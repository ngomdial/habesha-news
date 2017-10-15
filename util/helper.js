'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const result = require('./res');

const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

exports.contains = (obj, array) => {
    const length = array.length;
    if (length === 0) return false;
    for (let i = 0; i < length; i++) {
        
    }
};


exports.validateEmpty = (attr, message, reject, req) => {
    req.checkBody(attr, message).trim().notEmpty();
    let errors = req.validationErrors();
    if (errors) reject(result.reject(errors[0].msg));
};

exports.validateEmptyOnly = (attr, message, reject, req) => {
    req.checkBody(attr, message).notEmpty();
    let errors = req.validationErrors();
    if (errors) reject(result.reject(errors[0].msg));
};

exports.sanitizeTrim = (req, values) => {
    for (let i = 0; i < values.length; i++) {
        req.sanitize(values[i]).trim();
    }
};

exports.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                reject(result.reject(`Password comparison failed ${err}`));
            } else {
                resolve(result);
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
        })
    });
};

exports.genSalt = () => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(WORK_FACTOR, (err, salt) => {
            if (err) {
                reject(result.reject(`Salt generation failed: ${err}`));
            } else {
                resolve(salt);
            }
        });
    });
};

exports.generateToken = input => {
    let data = {
        id: input._id,
        profile: input.profile._id,
        created_at: input.created_at,
        updated_at: input.updated_at
    };
    let token = jwt.sign(data, process.env.API_JWT_USER_SECRET);
    return Promise.resolve(token);
};

// TODO: Write token validation logic