'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const deviceConfig = require('./device-config');
const userConfig = require('../user/user-config');
const data = require('../../config/data');

describe('Device Controller Test', () => {

    let body;

    const {token} = data.data;

    before(() => {
        return deviceConfig.deleteAll();
    });

    it('Should retrieve an empty list of devices', () => {
        return deviceConfig.findAll().then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail to create a device if user is missing', () => {
        return deviceConfig.create('').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to create a device if token is missing', () => {
        return deviceConfig.create(new mongoose.mongo.ObjectId(), '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('token');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to create a device if user does not exist', () => {
        return deviceConfig.create(new mongoose.mongo.ObjectId()).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User with');
            expect(body).to.have.property('message').contains('not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    describe('Device Creation/Retrieval/Removal Test', () => {

        let user, device;

        before(() => {
            return userConfig.deleteAll()
                .then(() => userConfig.signUp())
                .then(res => {
                    user = res.body;
                });
        });

        beforeEach(() => {
            return deviceConfig.deleteAll()
                .then(() => deviceConfig.create(user._id))
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(201);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('user').equal(user._id);
                    expect(body).to.have.property('token').equal(token);
                    device = res.body;
                });
        });

        describe('Device Creation Test', () => {
            it('Should fail to create a device if it already exists', () => {
                return deviceConfig.create(user._id).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Device with token');
                    expect(body).to.have.property('message').contains('already exists');
                    expect(body).to.have.property('status').equal(400);
                })
            });
        });

        describe('Device Removal Test', () => {
            it('Should fail to remove a device that does not exist', () => {
                return deviceConfig.remove(new mongoose.mongo.ObjectId()).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Device with _id');
                    expect(body).to.have.property('message').contains('does not exist');
                    expect(body).to.have.property('status').equal(404);
                });
            });

            it('Should successfully remove a device', () => {
                return deviceConfig.remove(device._id).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(false);
                    expect(body).to.have.property('message').contains('Device with _id');
                    expect(body).to.have.property('message').contains('has been removed');
                    expect(body).to.have.property('status').equal(200);
                });
            });

            it('Should successfully remove a device and retrieve an empty list of devices', () => {
                return deviceConfig.remove(device._id).then(res => {
                    expect(res.status).to.equal(200);
                    return deviceConfig.findAll();
                })
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('array');
                    expect(body).to.have.lengthOf(0);
                });
            });

            it('Should fail to remove a device that is already removed', () => {
                return deviceConfig.remove(device._id).then(res => {
                    expect(res.status).to.equal(200);
                    return deviceConfig.remove(device._id);
                })
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Device with _id');
                    expect(body).to.have.property('message').contains('does not exist');
                    expect(body).to.have.property('status').equal(404);
                });
            });
        });

        describe('Device Retrieval Test', () => {

            it('Should successfully retrieve a valid list of devices', () => {
                return deviceConfig.findAll().then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('array');
                    expect(body).to.have.lengthOf(1);
                    expect(body[0]).to.be.a('object');
                    expect(body[0]).to.have.property('user').equal(user._id);
                    expect(body[0]).to.have.property('token').equal(token);
                });
            });

            it('Should successfully retrieve a single valid device', () => {
                return deviceConfig.findOne(device._id).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('user').equal(user._id);
                    expect(body).to.have.property('token').equal(token);
                });
            });

            it('Should fail to retrieve a device that does not exist', () => {
                return deviceConfig.findOne(new mongoose.mongo.ObjectId()).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Device with _id');
                    expect(body).to.have.property('message').contains('does not exist');
                    expect(body).to.have.property('status').equal(404);
                });
            });
        });
    });
});