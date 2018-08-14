#/!/bin/bash
# Script to start 
#     1.Apache Spark-Master
#     2.HDFS
#     3.MongoDatabase
#     4.DeepShare Services
#     5.Backend Services

echo "Welcome to DeepShare services"

#Start Apache Spark Master- Check if the SPARK 8989
if ! lsof -i:8989
then
    ~/Documents/spark-2.3.0-bin-hadoop2.7/sbin/start-master.sh 
    echo "return status is $?"
else
    echo "return status is $?"
fi



#Start HDFS-Check if the hadoop UI is up and running
if ! lsof -i:50070
then
    ~/Documents/hadoop-2.7.5/sbin/start-dfs.sh
    echo "return status is $?"
else
    echo "return status is $?"
fi




#Start Mongo Database //Need to test if there was an error in starting up, will $? be returning 1 or 0
if ! lsof -i:27017
then
    mongod
    echo "return status is $?"
else
    echo "return status is $?"
fi


#Start DeepShare Services- Check if the 8080 port is used by any process
if ! lsof -i:8080
then
    node ~/Documents/api/app.js
    echo "return status is $?"
else
    echo "return status is $?"
fi


#Start Backend Services
#1.Scheduler.py
#2. Update_Job_Status.py

