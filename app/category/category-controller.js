'use strict';

const result = require('../../util/res');

const categoryDal = require('./category-dal');

const validator = require('./category-validator');

exports.create = (req, res) => {
    let name, color;
    validator.hasRequiredFields(req)
        .then(body => {
            name = body.name.toLowerCase();
            color = body.color;
            return categoryDal.findOne({name});
        })
        .then(found => {
            if (found) {
                return Promise.reject(
                    result.reject(`Category with name ${name} already exists`)
                );
            } else {
                return categoryDal.create({name, color});
            }
        })
        .then(category => result.data(category, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, id) => {
    categoryDal.findOne({_id: id})
        .then(category => {
            if (!category) {
                result.error(`Category with _id ${id} does not exist`, res);
            } else {
                req.category = category;
                next();
            }
        });
};

exports.findOne = (req, res) => {
    result.data(req.category, res);
};

exports.findAll = (req, res) => {
    categoryDal.findAll()
        .then(categories => {
            result.data(categories, res);
        });
};