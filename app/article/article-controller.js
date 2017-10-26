'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');
const helper = require('../../util/helper');

const articleDal = require('./article-dal');
const userDal = require('../user/user-dal');
const categoryDal = require('../category/category-dal');

const validator = require('./article-validator');

exports.create = (req, res) => {
    let headline, source_url, image_url, summary, poster, category;
    validator.hasRequiredFields(req)
        .then(body => {
            headline = body.headline;
            source_url = body.source_url;
            image_url = body.image_url;
            summary = body.summary;
            poster = body.poster;
            category = body.category;
            return userDal.findOne({_id: poster});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${poster} does not exist`, 404)
                );
            } else {
                return categoryDal.findOne({_id: category});
            }
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`Category with _id ${category} does not exist`, 404)
                );
            } else {
                return articleDal.create({
                    headline, source_url, image_url, summary, poster, category
                });
            }
        })
        .then(article => result.dataStatus(article, 201, res))
        .catch(reject => result.errorReject(reject, res));
};

const applyFollowUnFollow = (req, res, follow = true) => {
    let user, article = req.article;
    validator.hasFollowUnFollowFields(req)
        .then(body => {
            user = body.user;
            return userDal.findOne({_id: user});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${user} does not exist`, 404)
                );
            } else {
                user = found;
                if (follow) {
                    if (helper.containsId(user, article.followers)) {
                        return Promise.reject(
                            result.reject(`User with _id ${user._id} is already following this Article`)
                        );
                    } else {
                        article.followers.push(user._id);
                        return articleDal.update(article);
                    }
                } else {
                    if (!helper.containsId(user, article.followers)) {
                        return Promise.reject(
                            result.reject(`User with _id ${user._id} is not following this Article`)
                        );
                    } else {
                        article.followers.pull(user._id);
                        return articleDal.update(article);
                    }
                }
            }
        })
        .then(() => {
            result.messageStatus(`User with _id ${user._id} is ${follow ? 'now' : 'no longer'} following this Article`, 201, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.follow = (req, res) => {
    applyFollowUnFollow(req, res);
};

exports.unFollow = (req, res) => {
    applyFollowUnFollow(req, res, false);
};

// For running tests only!!
exports.resetFollowers = (req, res) => {
    const article = req.article;
    article.followers = [];
    articleDal.update(article)
        .then(updated => {
            result.data(updated, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, id) => {
    articleDal.findOne({_id: id})
        .then(article => {
            if (!article) {
                result.errorStatus(`Article with _id ${id} does not exist`, 404, res);
            } else {
                req.article = article;
                next();
            }
        });
};

exports.findOne = (req, res) => {
    result.data(req.article, res);
};

exports.findAll = (req, res) => {
    articleDal.findAll()
        .then(articles => {
            result.data(articles, res);
        });
};