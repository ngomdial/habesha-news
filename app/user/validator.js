'use strict';

const Promise = require('bluebird');
const result = require('../../util/res');

exports.hasLoginCredentials = req => {
    let errors;
    return new Promise((resolve, reject) => {
        req.checkBody('username', 'No username provided').trim().notEmpty();
        errors = req.validationErrors();
        if (errors) reject(result.reject(errors[0].msg));

        req.checkBody('password', 'No password provided').trim().notEmpty();
        errors = req.validationErrors();
        if (errors) reject(result.reject(errors[0].msg));

        req.sanitize('username').trim();
        req.sanitize('password').trim();

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