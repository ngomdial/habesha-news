'use strict';

require('../../config/index');

const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const Profile = require('../../../app/profile/model');
const dal = require('../../../app/profile/dal');

describe('profile dal.js', () => {

    const user_id = '59de86e5d84d75001f1fc6b0';
    const user_id_other = '59de86e5d84d75001f1fc6b1';

    beforeEach(() => {
        Profile.remove({}).exec();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Calls create(user_id)', () => {
        return dal.create(user_id)
            .then(profile => {
                expect(profile).to.be.a('object');
                sinon.assert.match(profile.user.toString(), user_id);
            });
    });

    it('Calls findOne(query)', () => {
        return dal
            .create(user_id)
            .then(profile => {
                console.log('Created profile:\n' + profile);
                return dal.findOne({user: user_id});
            })
            .then(profile => {
                console.log('Found profile:\n' + profile);
                expect(profile).to.be.a('object');
                sinon.assert.match(profile.user.toString(), user_id);
            });
    });

    it('Calls findOne(query) with non-existing user_id', () => {
        return dal
            .create(user_id)
            .then(() => {
                return dal.findOne({user: user_id_other});
            })
            .then(profile => {
                expect(profile).to.be.a('null');
            });
    });

    it('Calls findAll()', () => {
        return dal
            .findAll()
            .then(profiles => {
                expect(profiles).to.be.a('array');
                expect(profiles).to.be.empty;
            });
    });

    it('Calls findAll() with some data', () => {
        return dal
            .create(user_id)
            .then(() => {
                return dal.create(user_id_other);
            })
            .then(() => {
                return dal.findAll();
            })
            .then(profiles => {
                expect(profiles).to.be.a('array');
                expect(profiles).to.not.be.empty;
                expect(profiles).to.have.lengthOf(2);
            });
    });

    after(() => {
        mongoose.disconnect();
    });
});