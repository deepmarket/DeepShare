/**
 * @fileoverview This file contains configuration details for the application.
 * Namely, those are:
 *  - Parameters for the DB name and location
 *  - Json Web Token signature keys and salt parameters
 *  - Standard pathing for the routes, models, and controller modules
 *  - Possible job status' (Although this unlikely won't be used here)
 *
 * @exports {config} The applications configuration object.
 */

"use strict";

const config = {};

// Config parameters of the database.
config.API_ENDPOINT = "/api/v1";
config.DB_URI = "mongodb://localhost/ShareResources";
config.DB_TEST_URI = "mongodb://localhost/test";
config.DATABASE = "SHARE_RESOURCES";
config.JWT_KEY = "$h!r#res0urces";  // TODO: probably use env var instead?
config.SALT_ROUNDS = 10;

// Config for the PATHS. Make sure to check the below paths that are commonly used.
config.ROUTES_PATH = "./api/routes";
config.CONTROLLERS_PATH = "../controllers";
config.MODELS_PATH = "./api/models";
config.APPLICATION_CONFIG = "./api/config";

config.JOB_STATUS = {
    SCHEDULED: "Scheduled",
    // PENDING: "Pending",  // Voted to remove this in lieu of scheduled
    ACTIVE: "Active",
    FINISHED: "Finished",
    FAILED: "Failed",
};

module.exports = config;