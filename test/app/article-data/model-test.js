'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const ArticleData = require('../../../app/article-data/model');

describe('article data model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if article is missing', done => {
        let articleData = new ArticleData();
        articleData.validate(err => {
            expect(err.errors.article).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
