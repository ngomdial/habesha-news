'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Warning = require('../../../app/warning/model');

describe('warning model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if model is empty', done => {
        let warning = new Warning();

        warning.validate(err => {
            expect(err.errors.data).to.exist;
            expect(err.errors.message).to.exist;
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});