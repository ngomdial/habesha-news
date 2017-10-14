'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const User = require('../../../app/user/model');

describe('user model.js', () => {
    let sandbox;

    const username = 'saladthieves',
        email = 'salad@mail.com',
        password = 'someone';

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

    it('Should fail upon saving, if email is missing', done => {
        let user = new User({username, password});

        user.validate(err => {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('Should fail upon saving, if username is missing', done => {
        let user = new User({email, password});

        user.validate(err => {
            expect(err.errors.username).to.exist;
            done();
        });
    });

    it('Should fail upon saving, if password is missing', done => {
        let user = new User({email, username});

        user.validate(err => {
            expect(err.errors.password).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});