'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const test = require('./test');
const data = require('../../config/data');

describe('Users cont.js', () => {

    let body;

    beforeEach(() => test.deleteAll());

    describe('Login Test', () => {
        let res;

        beforeEach(() => {
            return test.signUp()
                .then(response => {
                    res = response;
                    expect(res.status).to.equal(201);
                });
        });

        it('Should fail to login if username is empty', done => {
            test.login(' ').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('provided');
                expect(body).to.have.property('status').equal(400);
                done();
            });
        });

        it('Should fail to login if password is empty', done => {
            test.login(undefined, '   ').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('provided');
                expect(body).to.have.property('status').equal(400);
                done();
            });
        });

        it('Should fail login if username is invalid', done => {
            test.login('someone').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('username or password');
                expect(body).to.have.property('status').to.equal(400);
                done();
            });
        });

        it('Should fail login if password is invalid', done => {
            test.login(undefined, 'abcd').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('username or password');
                expect(body).to.have.property('status').to.equal(400);
                done();
            });
        });

        it('Should login if a user has a valid username and password', done => {
            test.login().end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('token');
                expect(body).to.have.property('user');
                expect(body.user).to.have.property('username').to.equal(data.username);
                expect(body.user).to.have.property('email').to.equal(data.email);
                expect(body.user).to.have.property('profile');
                done();
            });
        });

        afterEach(() => test.deleteAll());
    });

    describe('Signup Test', () => {

        beforeEach(() => test.deleteAll());

        it('Should fail if username is missing', done => {
            test.signUp('  ').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('provided');
                expect(body).to.have.property('status').to.equal(400);
                done();
            });
        });

        it('Should fail if email is missing', done => {
            test.signUp(undefined, '   ').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('provided');
                expect(body).to.have.property('status').to.equal(400);
                done();
            });
        });

        it('Should fail if password is missing', done => {
            test.signUp(undefined, undefined, '   ').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('provided');
                expect(body).to.have.property('status').to.equal(400);
                done();
            });
        });

        describe('Double Registration Test', () => {
            let res;
            beforeEach(() => {
                return test.signUp()
                    .then(response => {
                        res = response;
                        body = res.body;
                        expect(res.status).to.equal(201);
                    });
            });

            it('Should fail if username is already registered', done => {
                test.signUp().end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').to.equal(true);
                    expect(body).to.have.property('message').to.contain('already exists');
                    expect(body).to.have.property('status').to.equal(400);
                    done();
                });
            });

            it('Should fail if email is already registered', done => {
                test.signUp().end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').to.equal(true);
                    expect(body).to.have.property('message').to.contain('already exists');
                    expect(body).to.have.property('status').to.equal(400);
                    done();
                });
            });

            afterEach(() => test.deleteAll());
        });


        it('Should signup if user has username, email, password', done => {
            test.signUp().end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('username');
                expect(body).to.have.property('email');
                expect(body).to.have.property('profile');
                done();
            });
        });

        afterEach(() => test.deleteAll());
    });

    afterEach(() => test.deleteAll());
});