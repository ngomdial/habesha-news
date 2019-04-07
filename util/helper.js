'use strict';

const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');

const result = require('./res');

const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

exports.containsId = (obj, array) => {
    const length = array.length;
    if (length <= 0) return false;
    for (let i = 0; i < length; i++) {
        if (obj._id.equals(array[i])) {
            return true;
        }
    }
    return false;
};

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

exports.generateToken = user => {
    const data = {
        id: user._id,
        created_at: user.created_at,
        updated_at: user.updated_at
    };

    let token = jwt.sign(data, process.env.API_JWT_USER_SECRET);
    return Promise.resolve(token);
};

exports.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, valid) => {
            if (err) {
                reject(result.reject(`Password comparison failed: ${err}`));
            } else {
                resolve(valid);
            }
        });
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