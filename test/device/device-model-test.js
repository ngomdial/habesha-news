'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const data = require('../../config/data');

const Device = require('../../app/device/device-model');

describe('Device Model Test', () => {

    const {token} = data.data;

    it('Should fail when no data is provided', done => {
        const device = new Device();

        device.validate(err => {
            expect(err.errors.user).to.exist;
            expect(err.errors.token).to.exist;
            done();
        });
    });

    it('Should fail when no user is missing', done => {
        const device = new Device({token});

        device.validate(err => {
            expect(err.errors.user).to.exist;
            expect(err.errors.token).to.not.exist;
            done();
        });
    });

    it('Should fail when no token is missing', done => {
        const device = new Device({user: new mongoose.mongo.ObjectId()});

        device.validate(err => {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.token).to.exist;
            done();
        });
    });

    it('Should have no validation errors if token and user are provided', done => {
        const device = new Device({user: new mongoose.mongo.ObjectId(), token});

        device.validate(err => {
            expect(err).to.not.exist;
            done();
        });
    });
});