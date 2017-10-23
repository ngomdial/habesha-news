'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const articleConfig = require('./article-config');

const data = require('../../config/data');

describe('Article Validation Test', () => {

    let body;

    const {articlesUrl, articleHeadline, sourceUrl, imageUrl, summary} = data.data;
    const poster = new mongoose.mongo.ObjectId();
    const category = new mongoose.mongo.ObjectId();

    it('Should fail if all data is missing', () => {
        return articleConfig.create('', '', '', '', '', '').then(res => {

            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if headline is missing', () => {
        return articleConfig.create('').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('headline');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if source_url is missing', () => {
        return articleConfig.create(undefined, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('source_url');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if image_url is missing', () => {
        return articleConfig.create(undefined, undefined, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('image_url');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if summary is missing', () => {
        return articleConfig.create(undefined, undefined, undefined, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('summary');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if poster is missing', () => {
        return articleConfig.create(undefined, undefined, undefined, undefined, '').then(res => {
            body = res.body;

            console.log(body);

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('poster');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });

    it('Should fail if category is missing', () => {
        return articleConfig.create(undefined, undefined, undefined, undefined, poster, '').then(res => {
            body = res.body;

            console.log(body);

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('category');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);

        });
    });
});