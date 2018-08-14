/**
 *
 * @fileoverview This file defines the api endpoints for jobs.
 *
 */

"use strict";

const router = require('express').Router();
const config = require('../config/config');

const verifyToken = require(`${config.CONTROLLERS_PATH}/verifyToken`);
const jobs_controller = require(`${config.CONTROLLERS_PATH}/jobs_controller`);

router.get('/', verifyToken, jobs_controller.get_all_jobs);

router.get('/:job_id', verifyToken, jobs_controller.get_job_by_job_id);

router.post('/', verifyToken, jobs_controller.add_job);

router.put('/:job_id', verifyToken, jobs_controller.update_job_status_by_job_id);

router.delete('/:job_id', verifyToken, jobs_controller.delete_job_by_job_id);

module.exports = router;
