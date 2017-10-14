'use strict';

const Promise = require('bluebird');

const articleDal = require('./dal');
const categoryDal = require('../category/dal');
const userDal = require('../user/dal');

const result = require('../../util/res');
const log = require('../../util/log');
const validator = require('./validator');

exports.create = (req, res) => {
    let category, user;

    validator.hasRequiredFields(req)
        .then(data => {
            console.log('');
            category = data.category;
            user = data.user;
            return categoryDal.findOne({_id: category});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(result.reject(`Category with _id ${category} does not exist`));
            } else {
                return userDal.findOne({_id: user});
            }
        })
        .then(found => {
            if (!found) {
                return Promise.reject(result.reject(`User with _id ${user} does not exist`));
            } else {
                result.messageStatus('Article created!', 201, res);
            }
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