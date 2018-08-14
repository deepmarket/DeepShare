/**
 * @fileoverview This file implements the routes for the customer endpoints.
 * It route's extend from the `/customer` endpoint
 * @exports {customer router}
 */

"use strict";

let router = require('express').Router();

const config = require('../config/config.js');
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
let customer_controller = require(`${config.CONTROLLERS_PATH}/customer_controller`);


/* GET ALL RESOURCES */
router.get('/', verifyToken, customer_controller.get_customer_by_id);

// Create a new customer
router.post('/', customer_controller.addcustomer);

// Update a customer's details
router.put('/', verifyToken, customer_controller.updateprofilebyid);

// Delete a customer's account
router.delete('/', verifyToken, customer_controller.deletecustomerbyid);

module.exports = router;
