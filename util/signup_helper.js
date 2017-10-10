'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const result = require('./res');

const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

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