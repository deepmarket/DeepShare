import os
import schedule
import time
from bson import ObjectId
from pymongo import MongoClient
import threading
from subprocess import Popen

# Set environment variables(if not set by user)
if not os.environ.get('SPARK_HOME'):
    os.environ['SPARK_HOME'] = "/home/spark/Documents/spark-2.3.0-bin-hadoop2.7"
if not os.environ.get('TFoS_HOME'):
    os.environ['TFoS_HOME'] = "/home/spark/Documents/TensorFlowOnSpark"


master = "spark://131.252.209.102:8989"

# Global variables to ensure one job is running
JOB_STATUS = 0
JOB_ID = 0

# SPARK_SUBMIT
# spark_submit_train = r'''$SPARK_HOME/bin/spark-submit --master {MASTER} --conf spark.app.name={NAME} --conf spark.executorEnv.LD_LIBRARY_PATH=$JAVA_HOME/lib/amd64/server:$HADOOP_HOME/lib/native --conf spark.executorEnv.CLASSPATH=$($HADOOP_HOME/bin/hadoop classpath --glob):$CLASSPATH --conf spark.executorEnv.HADOOP_HDFS_HOME=$HADOOP_HOME --py-files hdfs://{SOURCE_FILES} --conf spark.cores.max={TOTAL_CORES} --conf spark.task.cpus={CORES_PER_WORKER} --conf spark.executor.memory={MEMORY}g --conf spark.executorEnv.JAVA_HOME=$JAVA_HOME $TFoS_HOME/examples/mnist/spark/mnist_spark.py --cluster_size={SPARK_WORKER_INSTANCES} --images {IMAGES}/images --labels {LABELS}/labels --format csv --mode train --model mnist_model'''
#spark_submit_train = r'''/home/spark/Documents/spark-2.3.0-bin-hadoop2.7/bin/spark-submit --master {MASTER} --conf spark.app.name={NAME} --conf spark.executorEnv.LD_LIBRARY_PATH=$JAVA_HOME/lib/amd64/server:$HADOOP_HOME/lib/native --conf spark.executorEnv.CLASSPATH=$($HADOOP_HOME/bin/hadoop classpath --glob):$CLASSPATH --conf spark.executorEnv.HADOOP_HDFS_HOME=$HADOOP_HOME --py-files hdfs://{SOURCE_FILES} --conf spark.cores.max={TOTAL_CORES} --conf spark.task.cpus={CORES_PER_WORKER} --conf spark.executor.memory={MEMORY}g --conf spark.executorEnv.JAVA_HOME=$JAVA_HOME /home/spark/Documents/TensorFlowOnSpark/examples/mnist/spark/mnist_spark.py --cluster_size={SPARK_WORKER_INSTANCES} --images {IMAGES}/images --labels {LABELS}/labels --format csv --mode train --model mnist_model '''

spark_submit_train = r'''echo $SPARK_HOME '''

# Database connection
client = MongoClient('localhost', 27017)
db = client.ShareResources
jobs = db.jobs


# Check DB for scheduled jobs
def checkDB():
    print("Checking Database...")
    jobResults = jobs.find({"status": "Scheduled"}).sort("created_on")
    if jobResults.count() > 0:
        id = jobResults[0]['_id']
        doc = jobResults[0]
        updateResult = jobs.update_one({"_id": ObjectId(str(id))}, {"$set": {"status": "Submitted"}})
        job__submission__thread = threading.Thread(name='daemon' + str(id), target=submit_job(doc))
        job__submission__thread.daemon = True
        job__submission__thread.start()


# exit

# Submit job to SPARK
def submit_job(job):
    global JOB_STATUS
    global JOB_ID

    if JOB_STATUS == 0:
        # Submit the first job scheduled

        # Set all the parameters for spark-submit command
        # data_files = []
        input_files = job['input_files'][0]
        source_files = job['source_files'][0]
        memory = job['memory']
        cores = job['cores']
        workers = job['workers']
        total_cores = int(cores) * int(workers)
        name = job['_id']
        print(input_files+":workers")

        cmd_call = spark_submit_train.format(MASTER=master,
                                             NAME=name,
                                             SOURCE_FILES=source_files,
                                             TOTAL_CORES=total_cores,
                                             SPARK_WORKER_INSTANCES=workers,
                                             MEMORY=memory,
                                             CORES_PER_WORKER=cores,
                                             IMAGES=input_files,
                                             LABELS=input_files
                                             )

        updateResult = jobs.update_one({"_id": ObjectId(str(name))}, {"$set": {"status": "Running"}})
        JOB_ID = str(job['_id'])
        JOB_STATUS = 1
        # result = os.system(cmd_call)

        try:
            cmd_arr = [cmd_call]
            Popen(cmd_arr)

            JOB_ID = 0
            JOB_STATUS = 0
        except Exception as e:
            print(e)
            pass


# Schedule to check the database for any scheduled jobs
schedule.every(15).seconds.do(checkDB)

while True:
    schedule.run_pending()
    time.sleep(5)

