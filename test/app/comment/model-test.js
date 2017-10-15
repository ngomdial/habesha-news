'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Comment = require('../../../app/comment/model');

describe('comment model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if model is empty', done => {
        let comment = new Comment();

        comment.validate(err => {
            expect(err.errors.message).to.exist;
            expect(err.errors.data).to.exist;
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});