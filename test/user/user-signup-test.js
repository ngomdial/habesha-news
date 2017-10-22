'use strict';

const expect = require('chai').expect;

const userConfig = require('./user-config');
const data = require('../../config/data');

describe('User Sign-Up Test', () => {

    let {username, email, password} = data.data;

    let body;

    beforeEach(() => {
        return userConfig.deleteAll();
    });

    it('Should fail signup if username is missing', () => {
        return userConfig.signUp('').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('username');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail signup if email is missing', () => {
        return userConfig.signUp(undefined, '  ').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('email');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail signup if password is missing', () => {
        return userConfig.signUp(undefined, undefined, '  ').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('password');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail signup if username, email, password are missing', () => {
        return userConfig.signUp('', '', '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should successfully signup if username, email and password are provided', () => {
        return userConfig.signUp().then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('username').equal(username);
            expect(body).to.have.property('email').equal(email);
            expect(body).to.have.property('profile');
            expect(body.profile).to.have.property('user').equal(body._id);
        });
    });

    it('Should fail registration if username is already taken', () => {
        return userConfig.signUp().then(() => userConfig.signUp()).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('username is already taken');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail registration if email is already taken', () => {
        return userConfig.signUp().then(() => userConfig.signUp('someone_else')).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('email is already taken');
            expect(body).to.have.property('status').equal(400);
        });
    });

    afterEach(() => {
        return userConfig.deleteAll();
    });
});