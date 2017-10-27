'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('message', `No 'message' provided`, reject, req);
        helper.validateEmptyOnly('poster', `No 'poster' provided`, reject, req);
        helper.validateEmptyOnly('article', `No 'article' provided`, reject, req);

        helper.sanitizeTrim(req, ['message']);

        resolve(req.body);
    });
};

exports.hasLikeDislikeFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('user', `No 'user' provided`, reject, req);

        resolve(req.body);
    });
};