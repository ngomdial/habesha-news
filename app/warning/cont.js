'use strict';

const warningDal = require('./dal');
const result = require('../../util/res');

exports.findAll = (req, res) => {
    warningDal.findAll()
        .then(warnings => result.data(warnings, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, warningId) => {
    warningDal.findOne({_id: warningId})
        .then(warning => {
            if (warning) {
                req.warning = warning;
                next();
            } else {
                result.errorStatus(`Warning with _id ${warningId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.warning, res);