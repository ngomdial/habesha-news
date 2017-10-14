'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Profile = require('../../../app/profile/model');

describe('profile model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if user is missing', done => {
        let profile = new Profile();

        profile.validate(err => {
            expect(err.errors.user).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});