
"use strict";

const config = require('./api/config/config');
let mongoose = require('mongoose');

mongoose.set('bufferCommands', false);


// TODO: refactor so this is more OOP-esque...
let connect = async (db_name, debug=false) => {

    try {
        // TODO: i.e. add this to the constructor
        // Log mongoose events
        ['open', 'disconnected'].forEach(db_event => {
            mongoose.connection.on(db_event, () => {
                if(debug) {
                    console.log(`NOTICE: Database is now ${db_event}.`);
                }
            });
        });

        await mongoose.connect(db_name);
    } catch(err) {
        console.error(`ERROR: ${err}`);

        // Can't do much without a db connection; exit.
        process.exit(1)
    } finally {
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                if(debug) {
                    console.log('NOTICE: Closing database connection');
                }
                process.exit(0);
            });
        });
    }
};

// TODO: Add this to the destructor...
let close = () => {
    mongoose.connection.close(() => {
        console.log('NOTICE: Closing database connection');
    })
};

module.exports.open_connection = connect;
module.exports.close_connection = close;