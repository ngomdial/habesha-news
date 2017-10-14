'use strict';

const Promise = require('bluebird');

const articleDal = require('./dal');
const categoryDal = require('../category/dal');
const userDal = require('../user/dal');

const result = require('../../util/res');
const log = require('../../util/log');
const validator = require('./validator');

exports.create = (req, res) => {
    let headline, source_url, image_url, summary, category, poster;

    validator.hasRequiredFields(req)
        .then(data => {
            headline = data.headline;
            source_url = data.source_url;
            image_url = data.image_url;
            summary = data.summary;
            category = data.category;
            poster = data.poster;
            return categoryDal.findOne({_id: category});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(result.reject(`Category with _id ${category} does not exist`));
            } else {
                return userDal.findOne({_id: poster});
            }
        })
        .then(found => {
            if (!found) {
                return Promise.reject(result.reject(`User with _id ${poster} does not exist`));
            } else {
                return articleDal.create({headline, source_url, image_url, summary, category, poster});
            }
        })
        .then(article => {
            result.dataStatus(article, 201, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

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