'use strict';

const Promise = require('bluebird');

const warningDal = require('./warning-dal');
const userDal = require('../user/user-dal');
const articleDal = require('../article/article-dal');

const result = require('../../util/res');
const constants = require('../../util/constants');

const validator = require('./warning-validator');

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
                article = found;
                return addWarning(message, poster, article);
            }
        })
        .then(warning => result.dataStatus(warning, 201, res))
        .catch(reject => result.errorReject(reject, res));
};

const addWarning = (message, poster, article) => {
    let warning;

    let count = article.warnings.length;
    let status = article.status;

    if (status === constants.statuses.failed) {
        return Promise.reject(
            result.reject(`Cannot add Warning as Article with _id ${article._id} has already reached the 
                            maximum warning count of '${constants.MAX_WARNING_COUNT}' and is now '${status}'`
            )
        );
    }

    if (status === constants.statuses.approved) {
        return Promise.reject(
            result.reject(`Cannot add Warning as Article with _id ${article._id} is already approved`)
        );
    }

    if (count >= constants.MAX_WARNING_COUNT) {
        return Promise.reject(
            result.reject(`Cannot add Warning as Article with _id ${article._id} has already reached the 
                            maximum warning count of '${constants.MAX_WARNING_COUNT}' and is now '${status}'`
            )
        );
    } else {
        return warningDal.create({message, poster, article: article._id})
            .then(created => {
                warning = created;
                article.warnings.push(warning._id);
                count++;
                return articleDal.update(article);
            })
            .then(updated => {
                if (count >= constants.MAX_WARNING_COUNT) {
                    updated.status = constants.statuses.failed;
                    return articleDal.update(updated);
                } else {
                    return Promise.resolve(updated);
                }
            })
            .then(() => {
                return Promise.resolve(warning);
            });
    }
};

exports.validateOne = (req, res, next, id) => {
    warningDal.findOne({_id: id})
        .then(warning => {
            if (!warning) {
                result.errorStatus(`Warning with _id ${id} does not exist`, 404, res);
            } else {
                req.warning = warning;
                next();
            }
        });
};

exports.findOne = (req, res) => {
    result.data(req.warning, res);
};

exports.findAll = (req, res) => {
    warningDal.findAll()
        .then(warnings => {
            result.data(warnings, res);
        });
};