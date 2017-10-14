'use strict';

const articleDal = require('./dal');

const result = require('../../util/res');
const log = require('../../util/log');

exports.findAll = (req, res) => {
    articleDal
        .findAll()
        .then(articles => {
            result.data(articles, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

exports.validateOne = (req, res, next, articleId) => {
    articleDal
        .findOne({_id: articleId})
        .then(article => {
            if (article) {
                req.article = article;
                next();
            } else {
                result.errorStatus(`Article with _id ${articleId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.article, res);