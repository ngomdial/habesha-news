'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../../index');
const User = require('../../../app/user/model');
const Profile = require('../../../app/profile/model');

describe('user cont.js', () => {
    const username = 'saladthieves',
        email = 'salad@mail.com',
        password = 'something',
        base_url = process.env.BASE_URL + '/' + process.env.VERSION;

    let body;

    before(() => {
        return User.remove({}).exec().then(() => Profile.remove({}).exec());
    });


    describe('registration', () => {    // TODO: Change to promises
        let signup_url = base_url + '/users/signup';

        beforeEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });

        it('Should fail registration if body is empty', done => {
            let data = {};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
        });

        it('Should fail registration if email is missing', done => {
            let data = {username, password};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('email');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
        });

        it('Should fail registration if username is missing', done => {
            let data = {email, password};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('username');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
        });

        it('Should fail registration if password is missing', done => {
            let data = {email, username};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('password');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
        });

        it('Should register if a user has all the details', done => {
            let data = {email, username, password};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(201);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('username').equal(username);
                    expect(body).to.have.property('email').equal(email);
                    expect(body).to.have.property('profile').to.have.property('user');
                    done();
                });
        });

        it('Should fail if username is already registered', done => {
            let data = {email: 'person@domain.com', username, password};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end(() => {
                    chai.request(app)
                        .post(signup_url)
                        .send({email, username, password})
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);
                            expect(body).to.have.property('error').equal(true);
                            expect(body).to.have.property('message');
                            done();
                        });
                });
        });

        it('Should fail if email is already registered', done => {
            let data = {email, username: 'newer_username', password};

            chai.request(app)
                .post(signup_url)
                .send(data)
                .end(() => {
                    chai.request(app)
                        .post(signup_url)
                        .send({email, username, password})
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);
                            expect(body).to.have.property('error').equal(true);
                            expect(body).to.have.property('message');
                            done();
                        });
                });
        });

        afterEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });
    });

    after(() => {
        return User.remove({}).exec().then(() => Profile.remove({}).exec());
    });
});