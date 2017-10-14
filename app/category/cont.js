'use strict';

const categoryDal = require('./dal');
const result = require('../../util/res');
const log = require('../../util/log');

exports.findAll = (req, res) => {
    categoryDal.findAll()
        .then(categories => {
            result.data(categories, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

exports.validateOne = (req, res, next, categoryId) => {
    categoryDal.findOne({_id: categoryId})
        .then(category => {
            if (category) {
                req.category = category;
                next();
            } else {
                result.errorStatus(`Category with _id ${categoryId} does not exist`, 404, res);
            }
        });
};

exports.getOne = (req, res) => result.data(req.category, res);