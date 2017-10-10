'use strict';

const userDal = require('./dal');
const profileDal = require('../profile/dal');

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
            return userDal.findOne({email: data.email})
        })
        .then(user => {
            if (!user) {
                return userDal.findOne({username: data.username});
            } else {
                return Promise.reject(result.reject('This email address is already registered'));
            }
        })
        .then(user => {
            if (!user) {
                return helper.genSalt();
            } else {
                return Promise.reject(result.reject('This username already exists'));
            }
        })
        .then(salt => {
            return helper.hashPassword(data.password, salt);
        })
        .then(hash => {
            return userDal.create(data.username, data.email, hash);
        })
        .then(user => {
            data = user;
            return profileDal.create(user._id);
        })
        .then(profile => {
            data.profile = profile;
            return userDal.update(data);
        })
        .then(user => {
            result.dataStatus(user, 201, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

exports.findAll = (req, res) => {
    userDal.findAll()
        .then(users => {
            result.data(users, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};