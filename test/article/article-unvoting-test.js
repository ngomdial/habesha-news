'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');
const constants = require('../../util/constants');

describe('Article UnVoting Test', () => {

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

    beforeEach(() => articleConfig.resetVoters(article._id).then(() => articleConfig.vote(article._id, user._id)));

    it('Should fail to unvote if no user is provided', () => {
        return articleConfig.unVote(article._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to unvote if the user provided does not exist', () => {
        return articleConfig.unVote(article._id, article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should unvote on an article if the user provided is valid', () => {
        return articleConfig.unVote(article._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('has unvoted on this Article');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should unvote on an article and retrieve an empty list of voters', () => {
        return articleConfig.unVote(article._id, user._id).then(() => articleConfig.findOne(article._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('voters');
            expect(body.voters).to.be.a('array');
            expect(body.voters).to.have.lengthOf(0);
            expect(body).to.have.property('status').equal(constants.statuses.pending);
        });
    });

    it('Should unvote on an article and retrieve an empty list of voters (/GET voters)', () => {
        return articleConfig.unVote(article._id, user._id).then(() => articleConfig.findVoters(article._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail unvoting if the user has not voted beforehand', () => {
        return articleConfig.unVote(article._id, user._id).then(() => articleConfig.unVote(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('has not voted on this Article');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail unvoting if the article has already failed', () => {
        return articleConfig.updateStatus(article._id, constants.statuses.failed)
            .then(() => articleConfig.unVote(article._id, user._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('as it has already failed');
                expect(body).to.have.property('status').equal(400);
        });
    });


    it('Should fail unvoting if the article has already been approved', () => {
        return articleConfig.updateStatus(article._id, constants.statuses.approved)
            .then(() => articleConfig.unVote(article._id, user._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('as it has already been approved');
                expect(body).to.have.property('status').equal(400);
        });
    });
});