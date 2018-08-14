/**
 * @fileoverview This file contains the test definitions for the configuration details.
 */

"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;

chai.should();
chai.use(chai_http);

process.env.test = true;

/**
 * Tests the `api/config/config.js` file, ensuring that it
 * has the minimum configuration details to stand the server up.
 */
describe("config", function() {
    const config = require("../api/config/config");
    describe("constants", function() {
        it("should have an api endpoint extension", function(done) {
            let endpoint = config.API_ENDPOINT;
            expect(endpoint).to.be.a("string");
            expect(endpoint, "/api/v1").to.equal("/api/v1");
            done();
        });

        it("should have a database connection uri", function(done) {
            let db_uri = config.DB_URI;
            expect(db_uri).to.be.a("string");
            expect(db_uri.split('/')).to.have.lengthOf(4);
            expect(db_uri.split('/')[3], "ShareResources").to.equal('ShareResources');
            done();
        });

        it("should maintain an integer >= 10 for the number of bcrypt salt rounds", function(done) {
            let salts = config.SALT_ROUNDS;
            expect(salts).to.be.a('number');
            expect(salts).to.be.above(9);
            done();
        });
    });

    describe("constant paths", function() {
        // TODO: mehhh... probably need to verify paths/dirs exist or something.
        // it("should have an api folder")
    });
});