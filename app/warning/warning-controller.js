'use strict';

const warningDal = require('./warning-dal');

const result = require('../../util/res');

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