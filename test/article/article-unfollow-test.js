'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');

describe('Article UnFollowing Test', () => {

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
                return articleConfig.follow(article._id, user._id);
            });
    });

    it('Should fail to unfollow if the user is not provided', () => {
        return articleConfig.unFollow(article._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to unfollow if the user does not exist', () => {
        return articleConfig.unFollow(article._id, article._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should fail to unfollow if the article does not exist', () => {
        return articleConfig.unFollow(user._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('Article');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should unfollow a valid article with a valid user', () => {
        return articleConfig.follow(article._id, user._id).then(() => articleConfig.unFollow(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('is no longer following this Article');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should unfollow an article and remove the user from the followers list', () => {
        return articleConfig.follow(article._id, user._id).then(() => articleConfig.findOne(article._id)).then(res => {
            expect(res.status).to.equal(200);
            expect(res.body.followers[0]).to.equal(user._id);
            return articleConfig.unFollow(article._id, user._id).then(() => articleConfig.findOne(article._id));
        })
        .then(res => {
            body = res.body;
            expect(res.status).to.equal(200);
            expect(body.followers).to.have.lengthOf(0);
        });
    });

    it('Should fail to unfollow an article if user is not following it', () => {
        return articleConfig.resetFollowers(article._id).then(() => articleConfig.unFollow(article._id, user._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('is not following this Article');
            expect(body).to.have.property('status').equal(400);
        });
    });
});