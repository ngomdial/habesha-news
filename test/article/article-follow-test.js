'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');
const constants = require('../../util/constants');

describe('Article Following Test', () => {

    let body, user, category, article;

    before(() => {
        return articleConfig.deleteAll()
            .then(() => userConfig.deleteAll())
            .then(() => profileConfig.deleteAll())
            .then(() => categoryConfig.deleteAll())
            .then(() => userConfig.signUp())
            .then(res => {
                user = res.body;
                return categoryConfig.create({name: data.data.categoryName});
            })
            .then(res => {
                category = res.body;
                return articleConfig.createArticle(user._id, category._id);
            })
            .then(res => {
                article = res.body;
            });
    });

    beforeEach(() => articleConfig.updateStatus(article._id, constants.statuses.approved));

    it('Should have an empty list of followers on a new article', () => {
        return articleConfig.findOne(article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('followers');
            expect(body.followers).to.be.a('array');
            expect(body.followers).to.have.lengthOf(0);
        });
    });

    it('Should retrieve an empty list of followers on a new article', () => {
        return articleConfig.findFollowers(article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail to follow if the user is not provided', () => {
        return articleConfig.follow(article._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to follow if user does not exist', () => {
        return articleConfig.follow(article._id, article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should fail to follow an article that does not exit', () => {
        return articleConfig.follow(user._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('Article');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should fail to follow an article that is pending', () => {
        return articleConfig.updateStatus(article._id, constants.statuses.pending).then(() =>
            articleConfig.follow(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('this article as it is pending');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to follow an article that has failed', () => {
        return articleConfig.updateStatus(article._id, constants.statuses.failed)
            .then(() => articleConfig.follow(article._id, user._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('this article as it has failed');
                expect(body).to.have.property('status').equal(400);
            });
    });

    it('Should follow a valid approved article with a valid user', () => {
        return articleConfig.follow(article._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('is now following this Article');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should retrieve a valid list of followers on an article', () => {
        return articleConfig.resetFollowers(article._id).then(() => articleConfig.follow(article._id, user._id))
            .then(() => articleConfig.findFollowers(article._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
                expect(body[0]).to.equal(user._id);
            });
    });

    it('Should follow an article and add the follower to the list of followers', () => {
        return articleConfig.resetFollowers(article._id).then(() => articleConfig.follow(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            return articleConfig.findOne(article._id);
        })
            .then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('followers');
                expect(body.followers).to.be.a('array');
                expect(body.followers).to.have.lengthOf(1);
                expect(body.followers[0]).to.equal(user._id);
            });
    });

    it('Should fail to follow an article if user is already following it', () => {
        return articleConfig.resetFollowers(article._id).then(() => articleConfig.follow(article._id, user._id)).then(() =>
            articleConfig.follow(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('is already following this Article');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should reset the list of followers', () => {
        return articleConfig.follow(article._id, user._id).then(() => articleConfig.resetFollowers(article._id)).then(updated => {
            body = updated;

            expect(body).to.be.a('object');
            expect(body).to.have.property('followers');
            expect(body.followers).to.be.a('array');
            expect(body.followers).to.have.lengthOf(0);
        });
    });
});