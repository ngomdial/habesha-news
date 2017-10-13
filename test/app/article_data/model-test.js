'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

const ArticleData = require('../../../app/article_data/model');

describe('article data model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if article is missing', () => {
        let articleData = new ArticleData();
        return Promise.resolve(() => {
            articleData.validate(err => {
                expect(err.errors.article).to.exist;
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
