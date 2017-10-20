'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasSignUpFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('username', `No 'username' provided`, reject, req);
        helper.validateEmpty('email', `No 'email' provided`, reject, req);
        helper.validateEmpty('password', `No 'password' provided`, reject, req);

        helper.sanitizeTrim(req, ['username', 'email', 'password']);
        resolve(req.body);
    });
};

exports.hasLoginFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('username', `No 'username' provided`, reject, req);
        helper.validateEmpty('password', `No 'password' provided`, reject, req);

        helper.sanitizeTrim(req, ['username', 'password']);
        resolve(req.body);
    });
};