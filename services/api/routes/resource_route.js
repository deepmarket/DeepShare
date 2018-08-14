/**
 *
 * @fileoverview This file defines the api endpoints for resources.
 *
 */

"use strict";

const router = require('express').Router();
const config = require('../config/config');

const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
const resources_controller = require(`${config.CONTROLLERS_PATH}/resource_controller`);

// TODO: really can't think of a use for this
// router.get('/', resources_controller.getallresources);

router.get('/', verifyToken, resources_controller.get_resources_by_customer_id);

router.post('/', verifyToken, resources_controller.add_resource_by_customer_id);

router.put('/', verifyToken, resources_controller.update_resource_by_customer_id);

router.delete('/', verifyToken, resources_controller.delete_resource_by_id);
router.delete('/:resource_id', verifyToken, resources_controller.delete_resource_by_id);

module.exports = router;
