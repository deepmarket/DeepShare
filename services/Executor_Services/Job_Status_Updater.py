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

#check job status
def checkJobStatus(jobResults):
        #check job status (Add corresponding code to fetch the job status)
        doc = jobResults[0]
        jobStatus_url = requests.urlopen('http://131.252.209.102:8443/json/')
        data = jobStatus_url.read()
        encoding = jobStatus_url.info().get_content_charset('utf-8')
        JSON_object = json.loads(data.decode(encoding))
        
        #After submitting the Job through submitJob function, if the job status is checked before the job execution starts.
        #checkJobStatus should be able to check the status of the job
        #If there are no applications executed
        if len(JSON_object['activeapps']) != 0:   
            for job in JSON_object['activeapps']:
                if job['name'] == str(doc['_id']):
                    print("App name " + job['name'] + ",doc id " + str(doc['_id']) +",startTime" + str(job['starttime']) + str(doc))
                    #Update job status in database
                    updateResult = updateJobStatus(doc,job['state'])
                    #Reset the job status and job id
                    JOB_STATUS = 0
                    JOB_ID = 0
        if len(JSON_object['completedapps']) != 0:
             print("found completed apps")
             for job in JSON_object['completedapps']:
                print(job['name'], str(doc['_id']))
                if job['name'] == str(doc['_id']):
                    print("App name " + job['name'] + ",doc id " + str(doc['_id']) +",startTime" + str(job['starttime']))
                    #Update job status in database
                    updateResult = updateJobStatus(doc,job['state'])

if __name__== "__main__":
  #Database connection
    client = MongoClient('localhost', 27017)
    db=client.ShareResources
    jobs = db.jobs
    #Schedule to check the job status
    schedule.every(30).seconds.do(lambda: checkDB())

    while True:
        schedule.run_pending()
        time.sleep(1)
    
