'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const dal = require('../../app/user/user-dal');

const userConfig = require('./user-config');
const data = require('../../config/data');

describe('User Controller Test', () => {

    const {username, email} = data.data;

    let body;

    beforeEach(() => {
        return userConfig.deleteAll();
    });

    it('Should retrieve an empty list of users', () => {
        return userConfig.findAll().then(res => {
            body = res.body;

            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    describe('Retrieving Saved Users Test', () => {
        beforeEach(() => {
            return userConfig.deleteAll();
        });

        it('Should retrieve a list of saved users', () => {
            return userConfig.signUp().then(() => userConfig.findAll()).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
                expect(body[0]).to.have.property('username').equal(username);
                expect(body[0]).to.have.property('email').equal(email);
            });
        });

        it('Should retrieve a single saved user', () => {
            return userConfig.signUp().then(res => userConfig.findOne(res.body._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('username').equal(username);
                expect(body).to.have.property('email').equal(email);
            });
        });

        it('Should fail to retrieve an invalid user', () => {
            return userConfig.signUp().then(res => userConfig.findOne(new mongoose.mongo.ObjectId())).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('message').contains('User with _id');
                expect(body).to.have.property('status').equal(400);
            });
        });
    });

    afterEach(() => {
        return userConfig.deleteAll();
    });
});