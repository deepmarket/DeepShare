"use strict";

let express = require('express');  // Express server
let bodyParser = require('body-parser');  // HTTP body parsing middleware giving us access to `req.body`
let morgan = require('morgan');  // Logging middleware

const config = require('./api/config/config.js');  // Configuration details
const db = require('./db.js');
const resources = require(`${config.ROUTES_PATH}/resource_route.js`);  // Resource endpoints
const jobs = require(`${config.ROUTES_PATH}/jobs_route.js`);  // Job endpoints
const customer = require(`${config.ROUTES_PATH}/customer_route.js`);  // Customer endpoints
const authenticate = require(`${config.ROUTES_PATH}/auth_route.js`);  // Authentication endpoints
const pricing = require(`${config.ROUTES_PATH}/pricing_route`);  // Pricing endpoints
const DEBUG = process.env.DEBUG || true; // flag for verbose console output

// Strategically defines servers port in order of test, environment variable, and finally hardcoded.
const PORT = process.env.API_TEST ? 1234 : process.env.SERVER_PORT || 8080;

let app = express();
let router = express.Router();

// Show extended output in debug mode
let log_level = DEBUG ? "dev" : "tiny";

// Instantiate middleware
app.use(morgan(log_level));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Extend default endpoint to `/api/v1/`
app.use(config.API_ENDPOINT, router);

// Redirect req's from `/` to `/api/v1/`
app.get('/', (req, res) => {
    res.redirect(config.API_ENDPOINT)
});

// Display message at `/api/v1/` if the server is online
app.get(config.API_ENDPOINT, (req, res) => {
    res.send("<div style='margin: auto; display: flex'>API is: &nbsp;<div style='color: lightseagreen'> Online</div></div>");
});

// Define the server's endpoints
router.use('/auth', authenticate);
router.use('/account', customer);
router.use('/resources', resources);
router.use('/jobs', jobs);
router.use('/pricing', pricing);


db.open_connection(config.DB_URI, DEBUG);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    db.close_connection();
    process.exit(0);
});

/**
 * This function should be used as a no-op placeholder.
 * `()=>{}` is effectively equivalent to `Function.prototype`,
 * however, it's heavily optimized in V8.
 */
const noop = ()=>{};

app.listen(PORT, () => {
    DEBUG ? console.log(`Application open on port: ${PORT}.`) : noop;
});

/**
 * This function should be used primarily by the test harness for the purpose
 * of creating a new server.
 *
 * @returns {Promise<any>} A promise that resolves the new server.
 */
let create_server = () => {
    return new Promise((resolve, reject) => {
        try {
            app.listen(PORT, () => {
                DEBUG ? console.log(`Application open on port: ${PORT}.`) : noop;
                resolve(app);
            })
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * This function should be used by the test harness for the purpose
 * of forcefully stopping the server.
 */
let stop_server = (server) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(typeof server);
            server.close(() => {
                DEBUG ? console.log("Closing server.") : noop;
                resolve(process.exit(0));
            });
        } catch(err) {
            reject(err);
        }
    });
};

// Expose server to external resources
module.exports.create = create_server;
module.exports.close = stop_server;
