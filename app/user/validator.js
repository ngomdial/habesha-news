'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasLoginCredentials = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('username', 'No username provided', reject, req);
        helper.validateEmpty('password', 'No password provided', reject, req);

        helper.sanitizeTrim(req, ['username', 'password']);

        let {username, password} = req.body;

        resolve({username, password});
    });
};

exports.hasSignUpCredentials = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('email', 'No email provided', reject, req);
        helper.validateEmpty('username', 'No username provided', reject, req);
        helper.validateEmpty('password', 'No password provided', reject, req);

        helper.sanitizeTrim(req, ['email', 'username', 'password']);

        let {email, username, password} = req.body;

        resolve({email, username, password});
    });
};