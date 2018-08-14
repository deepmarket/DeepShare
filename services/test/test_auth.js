"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;
let mongoose = require("mongoose");

chai.should();
chai.use(chai_http);

process.env.test = true;

describe("Customer Authentication", function() {
    var server;
    const customer_payload = {
        firstname: "Felix",
        lastname: "Da Housecat",
        email: "abc@123.com",
        password: "password",
    };

    // TODO: Need to have a separate DB for testing and hardcode this guy in there.
    before("Add a user account to the database to interact with", function() {
        console.log("Creating user account");
    });
    after("Remove the user account from the database", function() {
        console.log("Removing user account");
    });

    // And of course we need to setup/teardown our server.
    beforeEach("Instantiate server", () => {
        server = require('../app').server;
        console.log("Creating clean server for test.");
    });

    afterEach("Tear down server", () => {
        require('../app').stop();
        console.log("Removing server from test.");
    });

    it("should allow the user to login", function(done) {
        done();
    });
    it("should allow the user the logout", function(done) {
        done();
    });
});