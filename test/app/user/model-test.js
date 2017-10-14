'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const User = require('../../../app/user/model');

describe('user model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if model is empty', done => {
        let user = new User({});

        user.validate(err => {
            expect(err).to.have.property('errors');
            expect(err.errors.username).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.password).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});