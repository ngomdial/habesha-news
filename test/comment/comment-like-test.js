'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const profileConfig = require('../profile/profile-config');
const articleConfig = require('../article/article-config');
const categoryConfig = require('../category/category-config');
const commentConfig = require('./comment-config');

const data = require('../../config/data');

describe('Comment Liking Test', () => {

    let body, user, otherUser, category, article, comment;

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
            .then(res => {
                article = res.body;
                return commentConfig.create(user._id, article._id);
            })
            .then(res => {
                comment = res.body;
                return userConfig.signUp('a', 'a', 'a');
            })
            .then(res => {
                otherUser = res.body;
            });
    });

    beforeEach(() => commentConfig.resetLikes(comment._id));

    it('Should retrieve an empty list of likes on a message', () => {
        return commentConfig.findLikes(comment._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail to like a comment if the user is missing', () => {
        return commentConfig.like(comment._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to like a comment if the user is invalid', () => {
        return commentConfig.like(comment._id, comment._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });

    it('Should fail to like a comment posted by the same user', () => {
        return commentConfig.like(comment._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('cannot like their own comment!');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should like a comment if user is valid and different from the comment poster', () => {
        return commentConfig.like(comment._id, otherUser._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('has added a like on this Comment');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should like a comment and add it to the list of likes on the comment', () => {
        return commentConfig.like(comment._id, otherUser._id).then(() => commentConfig.findOne(comment._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('likes');
            expect(body.likes).to.be.a('array');
            expect(body.likes).to.have.lengthOf(1);
            expect(body.likes[0]).to.equal(otherUser._id);
        });
    });

    it('Should like a comment and return a list of likes for the comment', () => {
        return commentConfig.like(comment._id, otherUser._id).then(() => commentConfig.findLikes(comment._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
            expect(body[0]).to.equal(otherUser._id);
        });
    });

    it('Should remove a like on the comment if previously liked by the same person', () => {
        return commentConfig.like(comment._id, otherUser._id)
            .then(() => commentConfig.like(comment._id, otherUser._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(false);
                expect(body).to.have.property('message').contains('has removed a like on this Comment');
                expect(body).to.have.property('status').equal(201);
            });
    });

    it('Should remove a like on the comment if previously liked by the same person and remove it from the likes list', () => {
        return commentConfig.like(comment._id, otherUser._id).then(() => commentConfig.like(comment._id, otherUser._id))
            .then(() => commentConfig.findOne(comment._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('likes');
                expect(body.likes).to.be.a('array');
                expect(body.likes).to.have.lengthOf(0);
            });
    });

    it('Should remove a like on the comment if previously liked by the same person and return an empty list of likes', () => {
        return commentConfig.like(comment._id, otherUser._id).then(() => commentConfig.like(comment._id, otherUser._id))
            .then(() => commentConfig.findLikes(comment._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(0);
            });
    });


    it('Should remove a dislike from the dislikes and add it to the likes upon liking a comment', () => {
        return commentConfig.resetLikes(comment._id).then(() => commentConfig.resetDislikes(comment._id)).then(() =>
            commentConfig.dislike(comment._id, otherUser._id)).then(res => {
            expect(res.status).to.equal(201);
            return commentConfig.findOne(comment._id);
        })
        .then(res => {
            body = res.body;

            expect(body).to.have.property('likes');
            expect(body.likes).to.be.a('array');
            expect(body.likes).to.have.lengthOf(0);
            expect(body).to.have.property('dislikes');
            expect(body.dislikes).to.be.a('array');
            expect(body.dislikes).to.have.lengthOf(1);
            expect(body.dislikes[0]).to.equal(otherUser._id);
            return commentConfig.like(comment._id, otherUser._id);
        })
        .then(res => {
            expect(res.status).to.equal(201);
            return commentConfig.findOne(comment._id);
        })
        .then(res => {
            body = res.body;

            expect(body).to.have.property('likes');
            expect(body.likes).to.be.a('array');
            expect(body.likes).to.have.lengthOf(1);
            expect(body.likes[0]).to.equal(otherUser._id);
            expect(body).to.have.property('dislikes');
            expect(body.dislikes).to.be.a('array');
            expect(body.dislikes).to.have.lengthOf(0);
        });
    });
});
