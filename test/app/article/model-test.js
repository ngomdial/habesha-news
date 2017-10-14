'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Article = require('../../../app/article/model');

describe('article model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if headline, source_url, image_url, summary, category, poster are missing', done => {
        let article = new Article();
        article.validate(err => {
            expect(err.errors.headline).to.exist;
            expect(err.errors.source_url).to.exist;
            expect(err.errors.image_url).to.exist;
            expect(err.errors.summary).to.exist;
            expect(err.errors.category).to.exist;
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});