'use strict';

const categoryDal = require('./dal');
const result = require('../../util/res');
const validator = require('./validator');

exports.create = (req, res) => {
    let name, color;
    validator.hasRequiredFields(req)
        .then(data => {
            name = data.name;
            color = data.color;
            return categoryDal.findOne({name: name.toLowerCase()});
        })
        .then(category => {
            if (category) {
                return Promise.reject(result.reject(`Category with name ${name} already exists`));
            } else {
                return categoryDal.create({name: name.toLowerCase(), color});
            }
        })
        .then(category => {
            result.dataStatus(category, 201, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

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

exports.findOne = (req, res) => result.data(req.category, res);