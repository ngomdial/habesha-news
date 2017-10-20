'use strict';

const expect = require('chai').expect;

const userConfig = require('./user-config');
const data = require('../../config/data');

describe('User Login Test', () => {

    let {username, email, password} = data.data;

    let body;

    beforeEach(() => {
        return userConfig.deleteAll();
    });

    it('Should fail login if username is missing', done => {
        userConfig.login('').end((err, res) => {
            body = res.body;

            expect(res.status).to.equal(400);
            done();
        });
        return userConfig.login('').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('username');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });


    it('Should fail login if password is missing', () => {
        return userConfig.login(undefined, ' ').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('password');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail login if username and password are missing', () => {
        return userConfig.login(undefined, ' ').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    describe('User Login With Wrong Credentials Test', () => {
        let user;
        beforeEach(() => {
            return userConfig.deleteAll()
                .then(() => userConfig.signUp())
                .then(res => {
                    user = res.body;
                    expect(res.status).to.equal(201)
                });
        });

        it('Should fail login if username does not exist', () => {
            return userConfig.login('helloworld').then(res => {
                body = res.body;


                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Invalid username or password');
                expect(body).to.have.property('status').equal(400);
            });
        });

        it('Should fail login if password does not exist', () => {
            return userConfig.login(undefined, 'some_weird_passwordz').then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Invalid username or password');
                expect(body).to.have.property('status').equal(400);
            });
        });

        it('Should fail login if username and password do not exist', () => {
            return userConfig.login('some_username_unwanted', 'some_weird_passwordz').then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Invalid username or password');
                expect(body).to.have.property('status').equal(400);
            });
        });

        it('Should login if username and password are correct', () => {
            return userConfig.login().then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('token');
                expect(body).to.have.property('user');
                expect(body.user).to.have.property('username').equal(username);
                expect(body.user).to.have.property('email').equal(email);
            });
        });

        afterEach(() => {
            return userConfig.deleteAll();
        });
    });

    afterEach(() => {
        return userConfig.deleteAll();
    });
});