"use strict";

const config = require('../config/config');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let customer = require('../models/customer_model');

exports.get_customer_by_id = (req, res) => {
    let message;
    let status = 200;

    customer.findById(req.user_id, (err, customer) => {
        if (err) {
            message = `Failed to get customer information.\nError: ${err.name}: ${err.message}`;
            status = 500;
        } else if (!customer) {
            status = 400;
            message = `Failed to get customer information.\nThe user with id '${req.user_id}' could not be found.`;
        } else {
           message = "Successfully fetched customer information.";
        }

        res.status(status).json({
            success: !!customer,  // `!!` is shorthanded boolean conversion
            error: err ? err : null,
            message: message,
            customer: customer,
        })
    });
};

/* Add a new customer to the collection */
exports.addcustomer = (req, res) => {
    let user;
    let message = "";
    let status = 200;

    bcrypt.hash(req.body.password, config.SALT_ROUNDS, (err, hash) => {
        user = new customer({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
            status: "Active",
        });

        user.save((err, new_user) => {
            if (err) {
                if (err.code === 11000) {
                    message = `Failed to create account.\nThe email '${req.body.email}' is already in use.`;
                    status = 400;
                } else {
                    message = `Failed to create account.\nError: ${err.name}: ${err.message}.`;
                    status = 500;
                }
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: null,
                    // auth: true, // TODO: Not sure about this yet
                });
            } else {
                message = "Successfully created account.";

                let jwt_payload = {
                    // email: req.body.email,
                    id: new_user._id,
                };
                jwt.sign(jwt_payload, config.JWT_KEY, {expiresIn: '24h'}, (err, token) => {
                    if (err) {
                        status = 400;
                        message = "Failed to create authentication token."
                    }
                    res.status(status).json({
                        success: !err,
                        error: err ? err : null,
                        message: message,
                        token: token,
                        user: new_user,
                        // auth: true, // TODO: Not sure about this yet
                    });
                });
            }
        });
    });
};

exports.updateprofilebyid = (req, res) => {
    let status = 501;
    let message = "NOT IMPLEMENTED";

    res.status(status).json({
        success: false,
        error: null,
        message: message,
    });
};

// TODO: rename this
exports.deletecustomerbyid = (req, res) => {
    let message = "";
    let status = 200;

    customer.findOneAndDelete({_id: req.user_id}, (err, customer) => {
        if(err) {
            status = 500;
            message = `Failed to remove user.\nError: ${err.name}.`;
        } else if(!customer) {
            // TODO: if customer is null this 'fails' silently. As in, it doesn't set err. Let client know?
            status = 400;
            message = `Failed to remove user.\nCould not find customer id.`;
        } else {
            message = "Successfully removed user.";
        }

        res.status(status).json({
            success: !!customer,
            error: err ? err : null,
            message: message,
        });
    });
};