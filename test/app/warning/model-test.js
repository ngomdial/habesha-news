'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

const Warning = require('../../../app/warning/model');

describe('warning model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if message is missing', () => {
        let warning = new Warning();

        return Promise.resolve(() => {
            warning.validate(err => {
                expect(err.errors.message).to.exist;
            });
        });
    });

    it('Should fail upon saving, if poster is missing', () => {
        let warning = new Warning();

        return Promise.resolve(() => {
            warning.validate(err => {
                expect(err.errors.poster).to.exist;
            });
        });
    });

    it('Should fail upon saving, if article is missing', () => {
        let warning = new Warning();

        return Promise.resolve(() => {
            warning.validate(err => {
                expect(err.errors.article).to.exist;
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});