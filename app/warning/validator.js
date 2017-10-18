'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('data', 'No data provided', reject, req);
        helper.validateEmpty('message', 'No message provided', reject, req);
        helper.validateEmptyOnly('poster', 'No poster provided', reject, req);

        helper.sanitizeTrim(req, ['message']);

        let {data, message, poster} = req.body;
        resolve({data, message, poster});
    });
};