/**
 * @fileoverview This file contains the definition of the customer schema.
 * It is dependent on mongoose.
 * @exports {customerSchema} The customer schema definition.
 */


"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let customerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        default: 20.0,
        min: 0,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Customers', customerSchema);  // Register model
let customers = mongoose.model('Customers');  // instantiate model

module.exports = customers;
