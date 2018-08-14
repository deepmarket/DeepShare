"use strict";

let chai = require('chai');
let chai_http = require('chai-http');
let expect = chai.expect;

chai.should();
chai.use(chai_http);

process.env.test = true;

describe('Customer Account Interaction', function() {
    const CUSTOMER_PAYLOAD  = {
        firstname: "Felix",
        lastname: "Da Housecat",
        email: "abc@123.com",
        password: "password",
    };

    var server;
    beforeEach("Instantiate server", () => {
        server = require('../app').server;
    });

    afterEach("Tear down server", () => {
        require('../app').stop();
    });

    describe('Account Management', function() {
        it('should add a new user account', function(done) {
            chai.request(server).post('/api/v1/account')
                .send(CUSTOMER_PAYLOAD)
                .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                // noinspection BadExpressionStatementJS
                expect(res).to.be.json;

                ["success", "message", "error"].forEach(val => {
                    res.body.should.have.a.property(val);
                });
                res.body.success.should.be.eql(true);
                // expect(res.body.error).to.be.null();
                CUSTOMER_PAYLOAD.token = res.body.token;
                done();
            });
        });
        it('should remove the customer by their unique `_id` attribute', function(done) {
            chai.request(server).delete(`/api/v1/account/`)
                .set('x-access-token', CUSTOMER_PAYLOAD.token)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    // noinspection BadExpressionStatementJS
                    expect(res).to.be.json;

                    ["success", "message", "error"].forEach(val => {
                       res.body.should.have.a.property(val);
                    });
                    res.body.success.should.be.eql(true);
                    done();
            });
        });
    });

    describe('Improper Account Management', function() {
        //TODO: set this up to use before and after hooks instead of describe scenarios
        describe('set up db for checking duplicate errors', function() {
            it('should create a new user account', function (done) {
                chai.request(server).post('/api/v1/account')
                    .send(CUSTOMER_PAYLOAD)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        CUSTOMER_PAYLOAD.token = res.body.token;
                        done();
                    });
            });
        });

        describe('verify failures', function() {
            it('should fail to add the same user account', function(done) {
                chai.request(server).post('/api/v1/account')
                    .send(CUSTOMER_PAYLOAD)
                    .end(function(err, res) {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        // noinspection BadExpressionStatementJS
                        expect(res).to.be.json;

                        ["success", "message", "error"].forEach(val => {
                            res.body.should.have.a.property(val);
                        });
                        res.body.success.should.be.eql(false);
                        // expect(res.body.error).to.be.null();
                        res.body.error.code.should.be.eql(11000);
                        done();
                    });
            });
            it('should remove the customer by their unique `_id` successfully', function(done) {
                chai.request(server)
                    .delete(`/api/v1/account/`)
                    .set("x-access-token", CUSTOMER_PAYLOAD.token)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        done();
                    });
            });
            it('should remove the customer by their unique `_id` unsuccessfully', function(done) {
                chai.request(server)
                    .delete(`/api/v1/account/`)
                    .set("x-access-token", CUSTOMER_PAYLOAD.token)
                    .end(function(err, res) {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        // noinspection BadExpressionStatementJS
                        expect(res).to.be.json;

                        ["success", "message", "error"].forEach(val => {
                            res.body.should.have.a.property(val);
                        });
                        res.body.success.should.be.eql(false);
                        done();
                    });
            });
        });
    });
});

/*
describe('/GET Resources', () => {
      it('it should GET all the resources', (done) => {
            chai.request(server)
            .get('api/v1/resources')
            .end((err, res, body) => {
                //res.should.have.status(200);
                //res.body.length.should.be.eql(0);
                //expect(res.statusCode).to.equal(200);
                console.log(body);
              done();
            });
      });
  });
*/

/*  describe('/POST book', () => {
      it('it should not POST a book without pages field', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a book ', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
            chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
              done();
            });
      });
  });
 /*
  * Test the /GET/:id route
  */
 /* describe('/GET/:id book', () => {
      it('it should GET a book by the given id', (done) => {
        let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        book.save((err, book) => {
            chai.request(server)
            .get('/book/' + book.id)
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
              done();
            });
        });

      });
  });*/