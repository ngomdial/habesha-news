'use strict';

const mongoose = require('mongoose');
const expect = require('chai').expect;

const data = require('../../config/data');

const Article = require('../../app/article/article-model');

describe('Article Model Test', () => {

    const {articleHeadline, sourceUrl, imageUrl, summary} = data.data;
    const poster = new mongoose.mongo.ObjectId();
    const category = new mongoose.mongo.ObjectId();

    it('Should fail if no data is provided', done => {
        const article = new Article();

        article.validate(err => {
            expect(err.errors.headline).to.exist;
            expect(err.errors.source_url).to.exist;
            expect(err.errors.image_url).to.exist;
            expect(err.errors.summary).to.exist;
            expect(err.errors.poster).to.exist;
            expect(err.errors.category).to.exist;
            done();
        });
    });

    it('Should fail if no headline is provided', done => {
        const article = new Article({
            source_url: sourceUrl,
            image_url: imageUrl,
            summary, poster, category
        });

        article.validate(err => {
            expect(err.errors.headline).to.exist;
            done();
        });
    });

    it('Should fail if no source_url is provided', done => {
        const article = new Article({
            headline: articleHeadline,
            image_url: imageUrl,
            summary, poster, category
        });

        article.validate(err => {
            expect(err.errors.source_url).to.exist;
            done();
        });
    });

    it('Should fail if no image_url is provided', done => {
        const article = new Article({
            headline: articleHeadline,
            source_url: sourceUrl,
            summary, poster, category
        });

        article.validate(err => {
            expect(err.errors.image_url).to.exist;
            done();
        });
    });

    it('Should fail if no summary is provided', done => {
        const article = new Article({
            headline: articleHeadline,
            source_url: sourceUrl,
            image_url: imageUrl,
            poster, category
        });

        article.validate(err => {
            expect(err.errors.summary).to.exist;
            done();
        });
    });

    it('Should fail if no poster is provided', done => {
        const article = new Article({
            headline: articleHeadline,
            source_url: sourceUrl,
            image_url: imageUrl,
            summary, category
        });

        article.validate(err => {
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    it('Should fail if no category is provided', done => {
        const article = new Article({
            headline: articleHeadline,
            source_url: sourceUrl,
            image_url: imageUrl,
            summary, poster
        });

        article.validate(err => {
            expect(err.errors.category).to.exist;
            done();
        });
    });
});