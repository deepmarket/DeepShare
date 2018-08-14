
"use strict";

let router = require('express').Router();

const config = require('../config/config');
const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
const authController = require(`${config.CONTROLLERS_PATH}/auth_controller`);

/* Create a new customer */
router.post('/login', authController.login);

router.post('/logout', verifyToken, authController.logout);

module.exports = router;
