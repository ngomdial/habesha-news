'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const userConfig = require('../user/user-config');
const profileConfig = require('../profile/profile-config');
const articleConfig = require('../article/article-config');
const categoryConfig = require('../category/category-config');
const commentConfig = require('./comment-config');

const data = require('../../config/data');

describe('Comment Disliking Test', () => {

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

    beforeEach(() => commentConfig.resetDislikes(comment._id));

    it('Should retrieve an empty list of dislikes on a message', () => {
        return commentConfig.findDislikes(comment._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    it('Should fail to dislike a comment if the user is missing', () => {
        return commentConfig.dislike(comment._id, '').then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('user');
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should fail to dislike a comment if the user is invalid', () => {
        return commentConfig.dislike(comment._id, comment._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(404);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('User');
            expect(body).to.have.property('message').contains('does not exist');
            expect(body).to.have.property('status').equal(404);
        });
    });


    it('Should fail to dislike a comment posted by the same user', () => {
        return commentConfig.dislike(comment._id, user._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('cannot dislike their own comment!');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should dislike a comment if user is valid and different from the comment poster', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(res => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('error').equal(false);
            expect(body).to.have.property('message').contains('has added a dislike on this Comment');
            expect(body).to.have.property('status').equal(201);
        });
    });

    it('Should dislike a comment and add it to the list of dislikes on the comment', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(() => commentConfig.findOne(comment._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('dislikes');
            expect(body.dislikes).to.be.a('array');
            expect(body.dislikes).to.have.lengthOf(1);
            expect(body.dislikes[0]).to.equal(otherUser._id);
        });
    });

    it('Should dislike a comment and return a list of dislikes for the comment', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(() => commentConfig.findDislikes(comment._id)).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(1);
            expect(body[0]).to.equal(otherUser._id);
        });
    });

    it('Should remove a dislike on the comment if previously disliked by the same person', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(() => commentConfig.dislike(comment._id, otherUser._id))
            .then(res => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(false);
                expect(body).to.have.property('message').contains('has removed a dislike on this Comment');
                expect(body).to.have.property('status').equal(201);
            });
    });

    it('Should remove a dislike on the comment if previously disliked by the same person and remove it from the dislikes list', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(() => commentConfig.dislike(comment._id, otherUser._id))
            .then(() => commentConfig.findOne(comment._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('dislikes');
                expect(body.dislikes).to.be.a('array');
                expect(body.dislikes).to.have.lengthOf(0);
            });
    });

    it('Should remove a dislike on the comment if previously disliked by the same person and return an empty list of dislikes', () => {
        return commentConfig.dislike(comment._id, otherUser._id).then(() => commentConfig.dislike(comment._id, otherUser._id))
            .then(() => commentConfig.findDislikes(comment._id)).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(0);
            });
    });

    it('Should remove a like from the likes and add it to the dislikes upon disliking a comment', () => {
        return commentConfig.resetLikes(comment._id).then(() => commentConfig.resetDislikes(comment._id)).then(() =>
            commentConfig.like(comment._id, otherUser._id)).then(res => {
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
            return commentConfig.dislike(comment._id, otherUser._id);
        })
        .then(res => {
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
        });
    });
});
