'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');
const helper = require('../../util/helper');

const commentDal = require('./comment-dal');
const userDal = require('../user/user-dal');
const articleDal = require('../article/article-dal');

const validator = require('./comment-validator');

exports.create = (req, res) => {
    let message, poster, article, comment;
    validator.hasRequiredFields(req)
        .then(body => {
            message = body.message;
            poster = body.poster;
            article = body.article;
            return userDal.findOne({_id: poster});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${poster} does not exist`, 404)
                );
            } else {
                return articleDal.findOne({_id: article});
            }
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`Article with _id ${article} does not exist`, 404)
                );
            } else {
                article = found;
                return commentDal.create({message, poster, article: article._id});
            }
        })
        .then(created => {
            comment = created;
            article.comments.push(comment._id);
            return articleDal.update(article);
        })
        .then(() => result.dataStatus(comment, 201, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, id) => {
    commentDal.findOne({_id: id})
        .then(comment => {
            if (!comment) {
                result.errorStatus(`Comment with _id ${id} does not exist`, 404, res);
            } else {
                req.comment = comment;
                next();
            }
        });
};

exports.like = (req, res) => {
    let user, comment = req.comment, added;
    validator.hasLikeDislikeFields(req)
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
                if (user._id.equals(comment.poster)) {
                    return Promise.reject(
                        result.rejectStatus(`User with _id ${user._id} cannot like their own comment!`, 400)
                    );
                } else {
                    if (helper.containsId(user, comment.likes)) {
                        comment.likes.pull(user._id);
                        added = false;
                    } else {
                        comment.likes.push(user._id);
                        comment.dislikes.pull(user._id);
                        added = true;
                    }
                    return commentDal.update(comment);
                }
            }
        })
        .then(() => {
            result.messageStatus(`User with _id ${user._id} has ${added ? 'added' : 'removed'} a like on this Comment`, 201, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.findLikes = (req, res) => {
    let comment = req.comment;
    result.data(comment.likes, res);
};

exports.dislike = (req, res) => {
    let user, comment = req.comment, added;
    validator.hasLikeDislikeFields(req)
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
                if (user._id.equals(comment.poster)) {
                    return Promise.reject(
                        result.rejectStatus(`User with _id ${user._id} cannot dislike their own comment!`, 400)
                    );
                } else {
                    if (helper.containsId(user, comment.dislikes)) {
                        comment.dislikes.pull(user._id);
                        added = false;
                    } else {
                        comment.dislikes.push(user._id);
                        comment.likes.pull(user._id);
                        added = true;
                    }
                    return commentDal.update(comment);
                }
            }
        })
        .then(() => {
            result.messageStatus(`User with _id ${user._id} has ${added ? 'added' : 'removed'} a dislike on this Comment`, 201, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.findDislikes = (req, res) => {
    let comment = req.comment;
    result.data(comment.dislikes, res);
};

exports.findOne = (req, res) => {
    result.data(req.comment, res);
};

exports.findAll = (req, res) => {
    commentDal.findAll()
        .then(comments => {
            result.data(comments, res);
        });
};