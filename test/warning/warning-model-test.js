'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const data = require('../../config/data');

const Warning = require('../../app/warning/warning-model');

describe('Warning Model Test', () => {
    const {warningMessage} = data.data;

    const poster = new mongoose.mongo.ObjectId();
    const article = new mongoose.mongo.ObjectId();

    it('Should fail if no data is provided', done => {
        const warning = new Warning();

        warning.validate(err => {
            expect(err.errors.message).to.exist;
            expect(err.errors.poster).to.exist;
            expect(err.errors.article).to.exist;
            done();
        });
    });

    it('Should fail if message is missing', done => {
        const warning = new Warning({poster, article});

        warning.validate(err => {
            expect(err.errors.message).to.exist;
            done();
        });
    });

    it('Should fail if poster is missing', done => {
        const warning = new Warning({message: warningMessage, article});

        warning.validate(err => {
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    it('Should fail if article is missing', done => {
        const warning = new Warning({message: warningMessage, poster});

        warning.validate(err => {
            expect(err.errors.article).to.exist;
            done();
        });
    });
});