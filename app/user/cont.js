'use strict';

const userDal = require('./dal');
const profileDal = require('../profile/dal');

const Promise = require('bluebird');
const result = require('../../util/res');
const log = require('../../util/log');
const helper = require('../../util/helper');
const validator = require('./validator');

exports.login = (req, res) => {
    let data, user;
    validator.hasLoginCredentials(req)
        .then(loginData => {
            data = loginData;
            return userDal.findOne({username: data.username});
        })
        .then(existing => {
            if (!existing) {
                return Promise.reject(result.reject('Invalid username or password'));
            } else {
                user = existing;
                return helper.genSalt();
            }
        })
        .then(salt => helper.hashPassword(data.password, salt))
        .then(() => helper.comparePassword(data.password, user.password))
        .then(valid => {
            if (valid) {
                return helper.generateToken(user);
            } else {
                return Promise.reject(result.reject('Invalid username or password'));
            }
        })
        .then(token => result.data({token, user}, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.signUp = (req, res) => {
    let data;
    validator.hasSignUpCredentials(req)
        .then(signUpData => {
            data = signUpData;
            return userDal.findOne({email: data.email})
        })
        .then(user => {
            if (!user) {
                console.log('Found no matching email');
                return userDal.findOne({username: data.username});
            } else {
                return Promise.reject(result.reject('This email address already exists'));
            }
        })
        .then(user => {
            if (!user) {
                console.log('Found no matching username');
                return helper.genSalt();
            } else {
                return Promise.reject(result.reject('This username already exists'));
            }
        })
        .then(salt => helper.hashPassword(data.password, salt))
        .then(hash => userDal.create(data.username, data.email, hash))
        .then(user => {
            data = user;
            return profileDal.create(user._id);
        })
        .then(profile => {
            data.profile = profile;
            return userDal.update(data);
        })
        .then(user => result.dataStatus(user, 201, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.findAll = (req, res) => {
    userDal.findAll()
        .then(users => result.data(users, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, userId) => {
    userDal.findOne({_id: userId})
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                result.errorStatus(`User with _id ${userId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.user, res);