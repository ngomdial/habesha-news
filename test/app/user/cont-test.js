'use strict';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const expect = chai.expect;

const app = require('../../../index');
const User = require('../../../app/user/model');
const Profile = require('../../../app/profile/model');

const test = require('./config');

describe('user cont.js', () => {
    const username = 'saladthieves',
        email = 'salad@mail.com',
        password = 'something',
        baseUrl = process.env.BASE_URL + '/' + process.env.VERSION,
        signUpUrl = baseUrl + '/users/signup';

    let signUpUser = (username, email, password) => request(app).post(signUpUrl).send({username, email, password});

    let body;

    before(() => test.deleteAll());

    describe('login test', () => {
        let res;

        before(() => {
            return test
                .signUp()
                .then(response => {
                    res = response;
                    expect(res.status).to.equal(201);
                });
        });

        it('Should fail login if username does not exist', done => {
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
                expect(body.user).to.have.property('username').to.equal(username);
                expect(body.user).to.have.property('email').to.equal(email);
                expect(body.user).to.have.property('profile');
                done();
            });
        });

        after(() => test.deleteAll());
    });


    describe('signup test', () => {
        beforeEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });

        it('Should fail if username is already registered', done => {
            signUpUser(username, email, password)
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    signUpUser(username, 'muhire@mail.com', password)
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);
                            expect(body).to.be.a('object');
                            expect(body).to.have.property('error').to.equal(true);
                            expect(body).to.have.property('message').to.contain('already');
                            expect(body).to.have.property('status').to.equal(400);
                            done();
                        });
                });
        });

        it('Should fail if email is already registered', done => {
            signUpUser(username, email, password)
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    signUpUser('cool_guy_8739', email, password)
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);
                            expect(body).to.be.a('object');
                            expect(body).to.have.property('error').to.equal(true);
                            expect(body).to.have.property('message').to.contain('already');
                            expect(body).to.have.property('status').to.equal(400);
                            done();
                        });
                });
        });

        it('Should signup if user has username, email, password', done => {
            signUpUser(username, email, password).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('username');
                expect(body).to.have.property('email');
                expect(body).to.have.property('profile');
                done();
            });
        });

        afterEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });
    });
});