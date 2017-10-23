'use strict';

const result = require('../../util/res');

const commentDal = require('./comment-dal');

const validator = require('./comment-validator');

exports.create = (req, res) => {
    // TODO: Finish this up
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