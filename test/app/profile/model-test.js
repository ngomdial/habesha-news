'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

const Profile = require('../../../app/profile/model');

describe('profile model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if user is missing', () => {
        let profile = new Profile();

        return Promise.resolve(() => {
            profile.validate(err => {
                expect(err.errors.user).to.exist;
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});

// TODO: Write tests for adding categories