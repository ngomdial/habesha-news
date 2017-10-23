'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');

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