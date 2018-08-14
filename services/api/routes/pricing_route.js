
"use strict";

let express = require('express');
let router = express.Router();
const config = require('../config/config');

let verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
let price_controller = require(`${config.CONTROLLERS_PATH}/pricing_controller`);

router.get('/', price_controller.get_prices);

// router.post('/', verifyToken, price_controller.add_price);

// router.put('/price_id', verifyToken, price_controller);

module.exports = router;
