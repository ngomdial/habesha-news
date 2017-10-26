'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const profileConfig = require('../profile/profile-config');
const articleConfig = require('../article/article-config');
const categoryConfig = require('../category/category-config');
const warningConfig = require('./warning-config');

const data = require('../../config/data');
const constants = require('../../util/constants');

describe('Warning Controller Test', () => {

    let body, user, category, article;

    let {warningMessage} = data.data;

    before(() => warningConfig.deleteAll());

    it('Should return an empty list of warnings', () => {
        return warningConfig.findAll().then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    describe('Warning Creation Test', () => {

        let warning;

        before(() => {
            return userConfig.deleteAll()
                .then(() => profileConfig.deleteAll()).then(() => articleConfig.deleteAll())
                .then(() => categoryConfig.deleteAll()).then(() => warningConfig.deleteAll())
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

        beforeEach(() => warningConfig.deleteAll());

        it('Should fail if poster does not exist', () => {
            return warningConfig.create(new mongoose.mongo.ObjectId(), article._id).then(res => {
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
            return warningConfig.create(user._id, new mongoose.mongo.ObjectId()).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('message').contains('Article');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should create a warning if both article and poster exist', () => {
            return warningConfig.create(user._id, article._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('message').equal(warningMessage);
                expect(body).to.have.property('article').equal(article._id);
                expect(body).to.have.property('poster').equal(user._id);
            });
        });

        it('Should create a warning and retrieve a list of warnings', () => {
            return warningConfig.create(user._id, article._id).then(() => warningConfig.findAll()).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
            });
        });

        it('Should create a warning and retrieve a single warning from the list of warnings', () => {
            return warningConfig.create(user._id, article._id).then(res => warningConfig.findOne(res.body._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('message').equal(warningMessage);
                expect(body).to.have.property('article').equal(article._id);
                expect(body).to.have.property('poster').equal(user._id);
            });
        });

        it('Should fail to retrieve a warning that does not exist', () => {
            return warningConfig.create(user._id, article._id).then(res => warningConfig.findOne(user._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Warning');
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(404);
            });
        });

        it('Should add a warning but not mark an article as failed if the warning count is still below the maximum', () => {
            return warningConfig.create(user._id, article._id)
                .then(() => warningConfig.create(user._id, article._id))
                .then(() => articleConfig.findOne(article._id)).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('_id').to.equal(article._id);
                    expect(body).to.have.property('warnings').to.be.a('array');
                    // expect(body.warnings).to.have.length.lessapprox TODO: Fix this statement
                });
        });

        it('Should mark an article as failed when the warning count reaches the maximum warning count', () => {
            return warningConfig.create(user._id, article._id)
                .then(() => warningConfig.create(user._id, article._id))
                .then(() => warningConfig.create(user._id, article._id))
                .then(() => articleConfig.findOne(article._id)).then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('_id').equal(article._id);
                    expect(body).to.have.property('warnings').to.be.a('array');
                    expect(body.warnings).to.have.lengthOf(constants.MAX_WARNING_COUNT);
                    expect(body).to.have.property('status').equal(constants.statuses.failed);
                });
        });

        it('Should create a warning and add it to the article list of warnings', () => {
            return articleConfig.deleteAll().then(() => articleConfig.createArticle(user._id, category._id))
                .then(res => {
                    article = res.body;
                    return warningConfig.create(user._id, article._id);
                })
                .then(res => {
                    warning = res.body;

                    expect(res.status).to.equal(201);
                    return articleConfig.findOne(article._id);
                })
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('_id').equal(article._id);
                    expect(body).to.have.property('warnings').to.be.a('array');
                    expect(body).to.have.property('status').equal(constants.statuses.pending);
                    expect(body.warnings).to.have.lengthOf(1);
                    expect(body.warnings[0]).to.equal(warning._id);
                });
        });

        it('Should fail if a user tries to post a warning on an article that has already failed', () => {
            return warningConfig.create(user._id, article._id)
                .then(() => warningConfig.create(user._id, article._id))
                .then(() => warningConfig.create(user._id, article._id))
                .then(() => warningConfig.create(user._id, article._id))
                .then(res => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('Cannot add Warning as Article with _id');
                    expect(body).to.have.property('status').equal(400);
                });
        });

        it('Should fail if a user tries to post a warning on an article that is approved', () => {
            return articleConfig.updateStatus(article._id, constants.statuses.approved).then(() =>
                warningConfig.create(user._id, article._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('Cannot add Warning as Article with _id');
                expect(body).to.have.property('message').contains('already approved');
                expect(body).to.have.property('status').equal(400);
            });
        });
    });
});
