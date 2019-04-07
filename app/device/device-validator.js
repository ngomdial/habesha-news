'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('user', `No 'user' provided`, reject, req);
        helper.validateEmpty('token', `No 'token' provided`, reject, req);

        helper.sanitizeTrim(req, ['token']);

        resolve(req.body);
    });
};