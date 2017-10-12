'use strict';

const Promise = require('bluebird');
require('dotenv').config();
require('../../../config/index');

const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const Profile = require('../../../app/profile/model');
const dal = require('../../../app/profile/dal');

describe('profile dal.js', () => {

    beforeEach(() => {
        Profile.remove({}).exec();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Calls create(user_id)', () => {
        const user_id = '59de86e5d84d75001f1fc6b0';
        return dal.create(user_id)
            .then(profile => {
                expect(profile).to.be.a('object');
                sinon.assert.match(profile.user.toString(), user_id);
            });
    });

    after(() => {
        mongoose.disconnect(err => {
            console.error(err);
        });
    });
});