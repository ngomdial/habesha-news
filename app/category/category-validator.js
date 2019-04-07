'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('name', `No 'name' provided`, reject, req);

        helper.sanitizeTrim(req, ['name']);
        resolve(req.body);
    });
};