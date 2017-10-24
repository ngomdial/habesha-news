'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');

describe('Article Controller Test', () => {

    const {articleHeadline, sourceUrl, imageUrl, articleSummary} = data.data;

    let body;

    before(() => articleConfig.deleteAll());

    it('Should return an empty list of articles', () => {
        return articleConfig.findAll()
            .then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(0);
            });
    });

    describe('Article Creation Test', () => {

        let user, category;

        before(() => {
            return userConfig.deleteAll()
                .then(() => profileConfig.deleteAll())
                .then(() => categoryConfig.deleteAll())
                .then(() => userConfig.signUp())
                .then(res => {
                    user = res.body;
                    return categoryConfig.create({name: data.data.categoryName})
                })
                .then(res => {
                    category = res.body;
                });
        });

        beforeEach(() => {
            return articleConfig.deleteAll();
        });

        it('Should fail if category does not exist', () => {
            return articleConfig.createArticle(user._id, new mongoose.mongo.ObjectId()).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Category');
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should fail if user does not exist', () => {
            return articleConfig.createArticle(new mongoose.mongo.ObjectId(), category._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('User');
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should create article if all data is given', () => {
            return articleConfig.createArticle(user._id, category._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('headline').equal(articleHeadline);
                expect(body).to.have.property('source_url').equal(sourceUrl);
                expect(body).to.have.property('image_url').equal(imageUrl);
                expect(body).to.have.property('summary').equal(articleSummary);
                expect(body).to.have.property('status').equal('pending');
                expect(body).to.have.property('poster').equal(user._id);
                expect(body).to.have.property('category').equal(category._id);
                expect(body).to.have.property('comments').to.have.lengthOf(0);
                expect(body).to.have.property('followers').to.have.lengthOf(0);
                expect(body).to.have.property('warnings').to.have.lengthOf(0);
                expect(body).to.have.property('voters').to.have.lengthOf(0);
            });
        });

        it('Should retrieve a list of saved articles', () => {
            return articleConfig.createArticle(user._id, category._id).then(() => articleConfig.findAll()).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
            });
        });

        it('Should retrieve a single valid article from a saved list of articles', () => {
            return articleConfig.createArticle(user._id, category._id)
                .then(res => articleConfig.findOne(res.body._id)).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('headline').equal(articleHeadline);
                    expect(body).to.have.property('source_url').equal(sourceUrl);
                    expect(body).to.have.property('image_url').equal(imageUrl);
                    expect(body).to.have.property('summary').equal(articleSummary);
                    expect(body).to.have.property('status').equal('pending');
                    expect(body).to.have.property('poster').equal(user._id);
                    expect(body).to.have.property('category').equal(category._id);
                    expect(body).to.have.property('comments').to.have.lengthOf(0);
                    expect(body).to.have.property('followers').to.have.lengthOf(0);
                    expect(body).to.have.property('warnings').to.have.lengthOf(0);
                    expect(body).to.have.property('voters').to.have.lengthOf(0);
                });
        });

        it('Should fail to retrieve an invalid article from a saved list', () => {
            return articleConfig.createArticle(user._id, category._id)
                .then(res => articleConfig.findOne(user._id)).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Article');
                    expect(body).to.have.property('message').contains('does not exist');
                    expect(body).to.have.property('status').equal(404);
                });
        });
    });

    after(() => articleConfig.deleteAll());
});