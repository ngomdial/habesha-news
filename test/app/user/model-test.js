'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

const User = require('../../../app/user/model');

describe('user model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if username is missing', () => {
        let user = new User();

        return Promise.resolve(() => {
            user.validate(err => {
                expect(err.errors.username).to.exist;
            });
        });
    });

    it('Should fail upon saving, if email is missing', () => {
        let user = new User();

        return Promise.resolve(() => {
            user.validate(err => {
                expect(err.errors.email).to.exist;
            });
        });
    });

    it('Should fail upon saving, if password is missing', () => {
        let user = new User();

        return Promise.resolve(() => {
            user.validate(err => {
                expect(err.errors.password).to.exist;
            });
        });
    });

    it('Should fail upon saving, if username, email and password are missing', () => {
        let user = new User();

        return Promise.resolve(() => {
            user.validate(err => {
                expect(err.errors.username).to.exist;
                expect(err.errors.email).to.exist;
                expect(err.errors.password).to.exist;
            });
        })
    });

    afterEach(() => {
        sandbox.restore();
    });
});