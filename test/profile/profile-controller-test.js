'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const profileConfig = require('./profile-config');
const userConfig = require('../user/user-config');

const data = require('../../config/data');

describe('Profile Controller Test', () => {
    let body;

    beforeEach(() => profileConfig.deleteAll().then(() => userConfig.deleteAll()));

    it('Should retrieve an empty list of profiles', () => {
        return profileConfig.findAll().then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    describe('Saved Profile Retrieval Test', () => {
        let user;
        beforeEach(() => {
            return profileConfig.deleteAll()
                .then(() => userConfig.deleteAll())
                .then(() => userConfig.signUp())
                .then(res => {
                    user = res.body;
                });
        });

        it('Should retrieve a non empty list of profiles', () => {
            return profileConfig.findAll().then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
                expect(body[0]).to.be.a('object');
            });
        });

        it('Should retrieve a single profile object', () => {
            return profileConfig.findOne(user.profile._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('user').equal(user._id);
            });
        });

        it('Should fail to retrieve an invalid profile', () => {
            return profileConfig.findOne(user._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(400);
            });
        });
    });

    afterEach(() => profileConfig.deleteAll().then(() => userConfig.deleteAll()));
});
