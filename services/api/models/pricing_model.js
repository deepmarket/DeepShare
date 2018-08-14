/**
 * @fileoverview This file contains the definition of the pricing schema.
 * It is dependent on mongoose.
 * @exports {pricingSchema} The price schema definition.
 */

"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let priceSchema = new Schema({
   // Combination of time_slot and created_on fields will give the price details for that particular day
    time_slot: {
        type: Number,
        required: true,
    },
    cpus: {
        type: Number,
        required: true,
        min: 0,
    },
    gpus: {
        type: Number,
        required: true,
        min: 0,
    },
    memory: {
        type: Number,
        required: true,
        min: 0,
    },
    disk_space: {
        type: Number,
        required: true,
        min: 0,
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedOn: {
        type: Date,
        default: Date.now
    },
});
// TODO: Verify model works w/o the following.
//}, {collection: "pricing"});

mongoose.model('Price', priceSchema);
let prices = mongoose.model('Price');

module.exports = prices;
