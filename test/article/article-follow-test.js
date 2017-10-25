'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const categoryConfig = require('../category/category-config');
const articleConfig = require('./article-config');
const profileConfig = require('../profile/profile-config');

const data = require('../../config/data');

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

    it('Should follow a valid article with a valid user', () => {
        return articleConfig.follow(article._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('is now following this Article');
            expect(body).to.have.property('status').equal(201);
        });
    });

    // Should follow an article and add user to the list of followers

    // Should fail to follow article if user is already following it
});