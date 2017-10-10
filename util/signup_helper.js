'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const result = require('./res');

const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

exports.hasLoginCredentials = body => {
    let {username, password} = body;
    return new Promise((resolve, reject) => {
        if (!username || !username.trim()) {
            reject(result.reject('No username provided'));
        }
        if (!password || !password.trim()) {
            reject(result.reject('No password provided'));
        }
        resolve({username, password});
    });
};

exports.hasSignUpCredentials = body => {
    let {email, username, password} = body;
    return new Promise((resolve, reject) => {
        if (!email || !email.trim()) {
            reject(result.reject('No email provided'));
        }
        if (!username || !username.trim()) {
            reject(result.reject('No username provided'));
        }
        if (!password || !password.trim()) {
            reject(result.reject('No password provided'));
        }
        resolve({email, username, password});
    });
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