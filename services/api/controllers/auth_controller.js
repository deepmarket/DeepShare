"use strict";

const config = require('../config/config');

let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let customer = require('../models/customer_model');

// Authenticate user; return token
exports.login = (req, res) => {
    let message;
    let status = 200;
    let token = "";
    let email = req.body.email;
    let plaintext_password = req.body.password;

    // TODO: man this is janky
    customer.findOne({"email": email}, "email password", (err, user) => {
        if (err) {
            message = "Failed to log in.\nPlease verify your email/password combination.";
            status = 400;
        } else if(!user) {
            message = "The provided email/password combination could not be found";
            status = 401;
            res.status(status).json({
                success: !!user,
                error: err ? err : null,
                message: message,
                token: null,
                auth: false,
            });
        } else {
            message = "Login successful";
            bcrypt.compare(plaintext_password, user.password).then(auth => {
                if(auth) {
                    token = jwt.sign({id: user._id}, config.JWT_KEY);
                }
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: token,
                    auth: true,
                });
            }).catch(err => {
                console.log(`Error in auth controller: ${err.name}`);
                message = "Failed to log in.\nPlease verify your email and password";
                status = 401;
                res.status(status).json({
                    success: !err,
                    error: err ? err : null,
                    message: message,
                    token: null,
                    auth: false,
                });
            });
        }
    });
};

exports.logout = (req, res) => {
    let message = "Successfully logged out.";
    let status = 200;

    res.status(status).json({
        success: true,
        error: null,
        message: message,
        token: null,
        auth: false,
    })
};