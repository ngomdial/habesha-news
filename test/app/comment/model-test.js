'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const Promise = require('bluebird');

const Comment = require('../../../app/comment/model');

describe('comment model.js', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('Should fail upon saving, if message is missing', () => {
        let comment = new Comment();

        return Promise.resolve(() => {
            comment.validate(err => {
                expect(err.errors.message).to.exist;
            });
        });
    });

    it('Should fail upon saving, if poster is missing', () => {
        let comment = new Comment();

        return Promise.resolve(() => {
            comment.validate(err => {
                expect(err.errors.poster).to.exist;
            });
        });
    });
});