'use strict';

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');

const result = require('./res');

const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

exports.validateEmpty = (attr, message, reject, req) => {
    validate(attr, message, reject, req);
};

exports.validateEmptyOnly = (attr, message, reject, req) => {
    validate(attr, message, reject, req, false);
};

const validate = (attr, message, reject, req, trim = true) => {
    if (trim) {
        req.checkBody(attr, message).trim().notEmpty();
    } else {
        req.checkBody(attr, message).notEmpty();
    }
    const errors = req.validationErrors();
    if (errors) reject(result.reject(errors[0].msg));
};

exports.sanitizeTrim = (req, values) => {
    for (let i = 0; i < values.length; i++) {
        req.sanitize(values[i]).trim();
    }
};

exports.comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash)
        .catch(error => {
            return Promise.reject(result.reject(`Comparing password failed: ${error}`));
        });
};

exports.hashPassword = (password, salt) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) {
                reject(result.reject(`Hashing password failed: ${err}`));
            } else {
                resolve(hash);
            }
        });
    });
};

exports.genSalt = () => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(WORK_FACTOR, (err, salt) => {
            if (err) {
                reject(result.reject(`Generating salt failed: ${err}`));
            } else {
                resolve(salt);
            }
        });
    });
};