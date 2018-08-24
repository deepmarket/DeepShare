#This service runs every 30 sec to update the status of the jobs which are submitted by the job_scheduler.
#Status of the job can be "Finished","Failed","Running"

#Check the status of the jobs which are already submitted by the job_scheduler in FIFO manner.
#


import sys
import shlex
import os
import schedule
import time
import pprint
from bson import ObjectId
from pyspark import SparkContext
from pyspark import SparkConf
from pymongo import MongoClient
from urllib import request as requests
import json
import subprocess



# check job status
def checkJobStatus(jobResults):
    # check job status (Add corresponding code to fetch the job status)
    jobStatus_url = requests.urlopen('http://131.252.209.102:8443/json/')
    data = jobStatus_url.read()
    encoding = jobStatus_url.info().get_content_charset('utf-8')
    JSON_object = json.loads(data.decode(encoding))

    # After submitting the Job through submitJob function, if the job status is checked before the job execution starts.
    # checkJobStatus should be able to check the status of the job
    # If there are no applications executed

    if len(JSON_object['completedapps']) != 0:
        for job in jobResults:
            #we can use hashmap to improve the performance.
            for app in JSON_object['completedapps']:
                if job['_id'] == str(app['_id']):
                    total_cores = app['cores']
                    total_cost_memory = app['memoryperslave'] * prices[job['time_slot']].memory
                    print(str(total_cost_memory) + " total memory cost")
                    total_cost_cores = total_cores * prices[job['time_slot']].cpus
                    totalcost=total_cost_cores+total_cost_memory
                    print(str(total_cost_cores) + "total cores cost")
                    print("Job:" + job['name'] + "completed in duration " + str(job['duration'] / 3600000.0) + "hrs")
                    updateResult = jobs.update_one({"_id": ObjectId(str(job['_id']))}, {"$set": {"price": totalcost, "status": "COMPLETED", "updateOn": str(date.today())}})



def update_job_status():
    global todayDate,update_prices_required
    #This block of code is executed when the script is run for the first time.
    if (date.today() + timedelta(1) - todayDate).days == 1 and update_prices_required:
        print("prices are downloaded into the array")
        update_prices()

    #This block of code is executed when the date has changed and update the prices with the recent ones.
    if (date.today() + timedelta(1) - todayDate).days != 1:
        #update both todayDate and prices
        print("updating both the prices and today date")
        update_prices()
        todayDate=date.today()
    checkDB()



def update_prices():
    global update_prices_required,prices
    prices_url = requests.urlopen('http://131.252.209.102:8080/api/v1/pricing')
    prices_data = prices_url.read()
    encoding = prices_url.info().get_content_charset('utf-8')
    prices_data_object = json.loads(prices_data.decode(encoding))
    if len(prices_data_object['prices']) != 0:
        for price in prices_data_object['prices']:
            prices.append(price)
    update_prices_required = False



#Check DB for scheduled jobs
def checkDB():
    print("Checking Database...")
    jobResults = jobs.find({"$or":[ {"status":"Submitted"}, {"status":"RUNNING"}]})
    print(jobResults)
    if jobResults.count() > 0:
      print("found Jobs")
      checkJobStatus(jobResults)
#exit


#Update module to update the records when jobs are submitted/finished
def updateJobStatus(doc,curr_status):
        objectId = doc['_id']
        updateResult = jobs.update_one({"_id":ObjectId(str(objectId))}, {"$set":{"status":curr_status}})
        return updateResult
#exit


todayDate = date.today()
update_prices_required = True

prices = []
client = MongoClient('localhost', 27017)
db = client.ShareResources
jobs = db.jobs
#Schedule to check the job status
schedule.every(5).seconds.do(lambda: update_job_status())


while True:
        schedule.run_pending()
        time.sleep(1)

