'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');
const constants = require('../../util/constants');

describe('Article Voting Test', () => {

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

    it('Should have an empty list of votes on a new article', () => {
        return articleConfig.findOne(article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.have.property('voters');
            expect(body.voters).to.be.a('array');
            expect(body.voters).to.have.lengthOf(0);
        });
    });

    it('Should retrieve an empty lit of voters on a new article', () => {
        return articleConfig.findVoters(article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail if no user is provided', () => {
        return articleConfig.vote(article._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail if the user provided does not exist', () => {
        return articleConfig.vote(article._id, article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should vote on an article if the user provided is valid', () => {
        return articleConfig.vote(article._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('has voted on this Article');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should vote on an article and retrieve a non empty list of voters', () => {
        return articleConfig.resetVoters(article._id).then(() => articleConfig.vote(article._id, user._id)).then(() =>
            articleConfig.findOne(article._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('voters');
            expect(body.voters).to.be.a('array');
            expect(body.voters).to.have.lengthOf(1);
        });
    });

    it('Should vote on an article and return a list of non empty voters (/GET voters)', () => {
        return articleConfig.resetVoters(article._id).then(() => articleConfig.vote(article._id, user._id)).then(() =>
            articleConfig.findVoters(article._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
            expect(body[0]).to.equal(user._id);
        });
    });

    it('Should fail if the user has already voted', () => {
        return articleConfig.resetVoters(article._id).then(() => articleConfig.vote(article._id, user._id)).then(() =>
            articleConfig.vote(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('has already voted on this Article');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail if the article has already failed', () => {
        return articleConfig.resetVoters(article._id).then(() => articleConfig.updateStatus(article._id, constants.statuses.failed)).then(() =>
            articleConfig.vote(article._id, user._id)).then(res => {

            body = res.body;
            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('already failed');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail if the article is already approved', () => {
        return articleConfig.resetVoters(article._id).then(() => articleConfig.updateStatus(article._id, constants.statuses.approved)).then(() =>
            articleConfig.vote(article._id, user._id)).then(res => {

            body = res.body;
            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('already been approved');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should auto-approve the article when the vote reaches the maximum', () => {
        let a, b, c, d;
        return articleConfig.updateStatus(article._id, constants.statuses.pending).then(() => userConfig.signUp('a', 'a'))
            .then(res => { a = res.body; return userConfig.signUp('b', 'b'); })
            .then(res => { b = res.body; return userConfig.signUp('c', 'c'); })
            .then(res => { c = res.body; return userConfig.signUp('d', 'd'); })
            .then(res => { d = res.body; return articleConfig.vote(article._id, a._id); })
            .then(() => articleConfig.vote(article._id, b._id))
            .then(() => articleConfig.vote(article._id, c._id))
            .then(res => articleConfig.vote(article._id, d._id))
            .then(res => articleConfig.vote(article._id, user._id))
            .then(() => articleConfig.findOne(article._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.have.property('voters');
                expect(body.voters).to.be.a('array');
                expect(body.voters).to.have.lengthOf(constants.MAX_APPROVAL_COUNT);
                expect(body.status).to.equal(constants.statuses.approved);
            });
    });

    it('Should update the status of an article', () => {
        return articleConfig.updateStatus(article._id, constants.statuses.failed).then(() => articleConfig.findOne(article._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.have.property('status').equal(constants.statuses.failed);
            expect(body).to.have.property('_id').equal(article._id);
        });
    });
});