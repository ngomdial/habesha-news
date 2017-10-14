'use strict';

const Promise = require('bluebird');
const result = require('../../util/res');
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
    let errors;
    return new Promise((resolve, reject) => {
        req.checkBody('email', 'No email provided').trim().notEmpty();
        errors = req.validationErrors();
        if (errors) reject(result.reject(errors[0].msg));

        req.checkBody('username', 'No username provided').trim().notEmpty();
        errors = req.validationErrors();
        if (errors) reject(result.reject(errors[0].msg));

        req.checkBody('password', 'No password provided').trim().notEmpty();
        errors = req.validationErrors();
        if (errors) reject(result.reject(errors[0].msg));

        req.sanitize('email').trim();
        req.sanitize('username').trim();
        req.sanitize('password').trim();

        let {email, username, password} = req.body;

        resolve({email, username, password});
    });
};