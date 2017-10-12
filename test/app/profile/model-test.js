'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const Profile = require('../../../app/profile/model');

describe('profile mode.js', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('Should fail upon saving, if user is missing', done => {
        let profile = new Profile();

        profile.validate(err => {
            expect(err.errors.user).to.exist;
            done();
        });
    });
});

// TODO: Write tests for adding categories