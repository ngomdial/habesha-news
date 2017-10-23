'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');

const commentDal = require('./comment-dal');
const userDal = require('../user/user-dal');
const articleDal = require('../article/article-dal');

const validator = require('./comment-validator');

exports.create = (req, res) => {
    let message, poster, article;
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
                return commentDal.create({message, poster, article});
            }
        })
        .then(comment => result.dataStatus(comment, 201, res))
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

exports.findOne = (req, res) => {
    result.data(req.comment, res);
};

exports.findAll = (req, res) => {
    commentDal.findAll()
        .then(comments => {
            result.data(comments, res);
        });
};