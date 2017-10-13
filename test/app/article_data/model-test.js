'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const ArticleData = require('../../../app/article_data/model');

describe('article data model.js', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('Should fail upon saving, if article is missing', done => {
        let articleData = new ArticleData();

        articleData.validate(err => {
            expect(err.errors.article).to.exist;
            done();
        });
    });
});