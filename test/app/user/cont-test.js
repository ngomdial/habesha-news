'use strict';

const chai = require('chai');
const request = require('supertest');
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

    describe('login test', () => {
        let login_url = base_url + '/users/login';

        beforeEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });

        const signUpUser = request(app).post(base_url + '/users/signup').send({email, username, password});
        const loginUser = request(app).post(base_url + '/users/login').send({username, password});

        it('Should login if a user has all the details', () => {
            return signUpUser
                .expect(200)
                .then(() => {
                    return loginUser;
                })
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('token');
                    expect(body.user).to.have.property('username').to.equal(username);
                    expect(body.user).to.have.property('email').to.equal(email);
                    expect(body.user).to.have.property('profile').to.have.property('user');
                })
                .catch(err => {
                    console.error(err);
                });
        });
        it('Should login if a user has all the details', done => {
            let data = {email, username, password};
            chai.request(app).post(base_url + '/users/signup').send(data)
                .end(() => {
                    chai.request(app)
                        .post(login_url)
                        .send({username, password})
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(200);
                            expect(body).to.be.a('object');
                            expect(body).to.have.property('token');
                            expect(body.user).to.have.property('username').to.equal(username);
                            expect(body.user).to.have.property('email').to.equal(email);
                            expect(body.user).to.have.property('profile').to.have.property('user');
                            done();
                        });
                });
        });

        it('Should fail login if the user has the wrong username', done => {
            let data = {email, username, password};
            chai.request(app).post(base_url + '/users/signup').send(data)
                .end(() => {
                    chai.request(app)
                        .post(login_url)
                        .send({username: 'cool_username', password})
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);

                            expect(body).to.be.a('object');
                            expect(body).to.have.property('error').to.equal(true);
                            expect(body).to.have.property('message');
                            expect(body).to.have.property('status').to.be.equal(400);
                            done();
                        });
                });

        });

        it('Should fail login if the user has the wrong password', done => {
            let data = {email, username, password};
            chai.request(app).post(base_url + '/users/signup').send(data)
                .end(() => {
                    chai.request(app)
                        .post(login_url)
                        .send({username, password: 'cool_passwd'})
                        .end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);

                            expect(body).to.be.a('object');
                            expect(body).to.have.property('error').to.equal(true);
                            expect(body).to.have.property('message');
                            expect(body).to.have.property('status').to.be.equal(400);
                            done();
                        });
                });
        });

        afterEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
        });
    });


    describe('registration test', () => {    // TODO: Change to promises
        let signup_url = base_url + '/users/signup';

        beforeEach(() => {
            return User.remove({}).exec().then(() => Profile.remove({}).exec());
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