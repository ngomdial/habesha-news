'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const User = require('../../../app/user/model');

describe('user mode.js', () => {

    afterEach(() => {
        sandbox.restore();
    });

    it('Should fail upon saving, if username is missing', done => {
        let user = new User();

        user.validate(err => {
            expect(err.errors.username).to.exist;
            done();
        });
    });

    it('Should fail upon saving, if email is missing', done => {
        let user = new User();

        user.validate(err => {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('Should fail upon saving, if password is missing', done => {
        let user = new User();

        user.validate(err => {
            expect(err.errors.password).to.exist;
            done();
        });
    });
});