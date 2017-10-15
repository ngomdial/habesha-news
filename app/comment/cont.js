'use strict';

const Promise = require('bluebird');

const commentDal = require('./dal');
const userDal = require('../user/dal');
const articleDataDal = require('../article-data/dal');
const result = require('../../util/res');
const validator = require('./validator');

exports.create = (req, res) => {
    let data, message, poster, comment;
    validator.hasRequiredFields(req)
        .then(body => {
            data = body.data;
            message = body.message;
            poster = body.poster;
            return userDal.findOne({_id: poster});
        })
        .then(user => {
            if (!user) {
                return Promise.reject(result.rejectStatus(`User with _id ${poster} does not exist`, 404));
            } else {
                return articleDataDal.findOne({_id: data});
            }
        })
        .then(articleData => {
            if (!articleData) {
                return Promise.reject(result.rejectStatus(`ArticleData with _id ${data} does not exist`, 404));
            } else {
                data = articleData;
                return commentDal.create({data: data._id, message, poster});
            }
        })
        .then(postedComment => {
            comment = postedComment;
            data.comments.push(comment._id);
            return data.save();
        })
        .then(() => {
            result.dataStatus(comment, 201, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

exports.findAll = (req, res) => {
    commentDal.findAll()
        .then(comments => result.data(comments, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, commentId) => {
    commentDal.findOne({_id: commentId})
        .then(comment => {
            if (comment) {
                req.comment = comment;
                next();
            } else {
                result.errorStatus(`Comment with _id ${commentId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.comment, res);