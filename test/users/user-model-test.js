'use strict';

const expect = require('chai').expect;

const data = require('./user-data');

const User = require('../../app/user/user-model');

describe('User Model Test', () => {

    const {username, email, password} = data;

    it('Should fail validation if username is missing', done => {
        const user = new User({email, password});

        user.validate(err => {
            expect(err.errors.username).to.exist;
            done();
        });
    });

    it('Should fail validation if email is missing', done => {
        const user = new User({username, password});

        user.validate(err => {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('Should fail validation if is missing', done => {
        const user = new User({email, password});

        user.validate(err => {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('Should fail validation if username, email, password are missing', done => {
        const user = new User();
        user.validate(err => {
            expect(err.errors.username).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.password).to.exist;
            done();
        });
    })
});