'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('data', 'No data provided', reject, req);
        helper.validateEmpty('message', 'No message provided', reject, req);
        helper.validateEmptyOnly('poster', 'No poster provided', reject, req);

        helper.sanitizeTrim(req, ['message']);

        resolve(req.body);
    });
};

exports.hasRequiredRateFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('user', 'No user provided', reject, req);
        resolve(req.body.user);
    });
};