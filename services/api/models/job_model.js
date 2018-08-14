/**
 * @fileoverview This file contains the definition of the jobs schema.
 * It is dependent on mongoose.
 * @exports {jobSchema} The job schema definition.
 */

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let jobSchema = new Schema({
    workers: {
        type: String,
        required: true
    },
    cores: {
        type: String,
        required: true
    },
    memory: {
        type: String,
        required: true
    },
    source_files: {
        type: [String],
        required: true
    },
    input_files: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: "PENDING",
        required: true
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    logs: {
        type: [String]
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //To keep track of the resources that are used to run the job
    resources: [{
         resource_id: String,
         price: Number
     }],
    timeslot_id: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    created_on: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_on: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// Create a model to interact with from the schema
mongoose.model('Jobs', jobSchema);
let jobs = mongoose.model('Jobs');

module.exports = jobs;
