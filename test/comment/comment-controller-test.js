'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const profileConfig = require('../profile/profile-config');
const articleConfig = require('../article/article-config');
const categoryConfig = require('../category/category-config');
const commentConfig = require('./comment-config');

const data = require('../../config/data');

describe('Comment Controller Test', () => {

    let body, user, category, article;

    const {commentMessage} = data.data;

    before(() => commentConfig.deleteAll());

    it('Should return an empty list of comments', () => {
        return commentConfig.findAll().then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    describe('Comment Creation Test', () => {

        let comment;

        before(() => {
            return userConfig.deleteAll()
                .then(() => profileConfig.deleteAll()).then(() => articleConfig.deleteAll())
                .then(() => categoryConfig.deleteAll()).then(() => commentConfig.deleteAll())
                .then(() => userConfig.signUp()).then(res => {
                    user = res.body;
                    return categoryConfig.create({name: data.data.categoryName});
                })
                .then(res => {
                    category = res.body;
                    return articleConfig.createArticle(user._id, category._id)
                })
                .then(res => article = res.body);
        });

        beforeEach(() => commentConfig.deleteAll());

        it('Should fail if poster does not exist', () => {
            return commentConfig.create(new mongoose.mongo.ObjectId(), article._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('message').contains('User');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should fail if article does not exist', () => {
            return commentConfig.create(user._id, new mongoose.mongo.ObjectId()).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('message').contains('Article');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should create a comment if article and poster are valid', () => {
            return commentConfig.create(user._id, article._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('message').equal(commentMessage);
                expect(body).to.have.property('article').equal(article._id);
                expect(body).to.have.property('poster').equal(user._id);
            });
        });

        it('Should create a comment and retrieve a list of saved comments', () => {
            return commentConfig.create(user._id, article._id).then(() => commentConfig.findAll()).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
            });
        });

        it('Should create a comment and retrieve a single saved comment', () => {
            return commentConfig.create(user._id, article._id).then(res => commentConfig.findOne(res.body._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('poster').equal(user._id);
                expect(body).to.have.property('message').equal(commentMessage);
                expect(body).to.have.property('article').equal(article._id);
            });
        });

        it('Should fail to retrieve a comment that does not exist', () => {
            return commentConfig.create(user._id, article._id).then(() => commentConfig.findOne(user._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('message').contains('Comment');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should create a comment and add the poster to the article comments', () => {
            return articleConfig.deleteAll().then(() => articleConfig.createArticle(user._id, category._id))
                .then(res => {
                    article = res.body;
                    return commentConfig.create(user._id, article._id);
                })
                .then(res => {
                    comment = res.body;

                    expect(res.status).to.equal(201);
                    return articleConfig.findOne(article._id);
                })
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('_id').equal(article._id);
                    expect(body).to.have.property('comments').to.be.a('array');
                    expect(body.comments).to.have.lengthOf(1);
                    expect(body.comments[0]).to.equal(comment._id);
                });
        });

        afterEach(() => commentConfig.deleteAll());
    });
});