/**
 *
 * @fileoverview This file implements the logic for the job endpoints.
 * It is dependent on the job route module.
 *
 */

"use strict";

const config = require('../config/config');
const customer = require("../models/customer_model");
const jobs = require('../models/job_model');

exports.get_all_jobs = (req, res) => {
    let status = 200;
    let message = "";

    jobs.find({customer_id: req.user_id}, (err, jobs) => {
        if (err) {
            message = `There was an error while trying to retrieve the jobs for the customer: 
                        ${req.user_id}\nError: ${err.name}`;
            status = 401;
        } else {
            message = "Successfully retrieved jobs.";
        }
        res.status(status).json({
            success: !!jobs,  // `!!` is shorthand boolean conversion
            error: err ? err : null,
            message: message,
            jobs: jobs
        })
    });
};

/* GET ALL jobs BY CUSTOMER_ID */
exports.get_job_by_job_id = (req, res) => {
    let status = 200;
    let message = "";

    jobs.find({
        customer_id: req.user_id,
        id: req.params.job_id,
    }, (err, job) => {
        if (err) {
            message = `There was an error while trying to retrieve that specific job.\nError: ${err.name}`;
            status = 401;
        } else {
            message = "Successfully retrieved job.";
        }
        job.updated_on = Date.now();
        res.status(status).json({
            success: !!job,
            error: err ? err : null,
            message: message,
            job: job,
        })
    });
};

/* ADD NEW Jobs UNDER THE USER ACCOUNT */
exports.add_job = (req, res) => {
    let status = 200;
    let message = "";

    let job = new jobs({
        workers: req.body.workers,
        cores: req.body.cores,
        memory: req.body.memory,
        timeslot_id: req.body.timeslot_id,
        status: config.JOB_STATUS.SCHEDULED,
        price: req.body.price,
        customer_id: req.user_id,
        created_on: Date.now(),
        updated_on: Date.now(),
        created_by: req.user_id,
        updated_by: req.user_id,
    });

    // HDFS path where the files are uploaded, before submitting the job
    job.source_files.push(req.body.source_files);
    job.input_files.push(req.body.input_files);

    // Decrement users credits accordingly.
    let customer_promise = customer.findOneAndUpdate({_id: req.user_id}, {$inc: {credits: -req.body.price}}).exec();
    customer_promise.catch(err => {
        message = `There was an error charging your account.\nError: ${err.name}: ${err.message}\n`;
        status = 500;
    });

    job.save((err, job) => {
        if (err) {
            message += `There was an error while trying to add the job to the queue.\nError: ${err.name}`;
            status = 500;
        } else {
            message = "Successfully added job to the queue.";
        }
        res.status(status).json({
            success: !!job,
            error: err ? err : null,
            message: message,
            job: job
        });
    });

};

/* UPDATE job DETAILS */
exports.update_job_status_by_job_id = (req, res) => {
    let status = 501;
    let message = "Not Implemented";

    res.status(status).json({
        success: true,
        error: null,
        message: message,
    });
};

/* DELETE job by using the job and customer id's provided by the client */
exports.delete_job_by_job_id = function(req, res) {
    let status = 200;
    let message = "";

    jobs.remove({
        _id: req.params.job_id,
        customer_id: req.user_id,
    }, (err) => {
        if (err) {
            message = `There was an error while trying to delete that specific job.\nError: ${err.name}`;
            status = 401;
        } else {
            message = "Job successfully deleted.";
        }
        res.status(status).json({
            success: !err,
            error: err ? err : null,
            message: message,
        });
    });
};