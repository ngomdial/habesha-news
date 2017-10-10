'use strict';

const userDal = require('./dal');

const Promise = require('bluebird');
const result = require('../../util/res');
const log = require('../../util/log');
const helper = require('../../util/signup_helper');

exports.signUp = (req, res) => {
    let body = req.body;
    let data;
    helper.hasSignUpCredentials(body)
        .then(signUpData => {
            data = signUpData;
        })

        .then(() => {
            result.message('registration completed', res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};