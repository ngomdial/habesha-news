'use strict';

const commentDal = require('./dal');
const result = require('../../util/res');

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