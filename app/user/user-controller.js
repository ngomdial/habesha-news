'use strict';

const Promise = require('bluebird');
const result = require('../../util/res');
const helper = require('../../util/helper');

const userDal = require('./user-dal');

const validator = require('./user-validator');

exports.login = (req, res) => {
    let username, password, user;
    validator.hasLoginFields(req)
        .then(body => {
            username = body.username;
            password = body.password;
            return userDal.findOne({username});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.reject(`Invalid username or password`)
                );
            } else {
                user = found;
                return helper.comparePassword(password, user.password);
            }
        })
        .then(valid => {
            if (valid) {
                return helper.generateToken(user);
            } else {
                return Promise.reject(
                    result.reject(`Invalid username or password`)
                );
            }
        })
        .then(token => {
            result.data({token, user}, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.signUp = (req, res) => {
    let username, email, password;
    validator.hasSignUpFields(req)
        .then(body => {
            username = body.username;
            email = body.email;
            password = body.password;
            return userDal.findOne({username});
        })
        .then(found => {
            if (found) {
                return Promise.reject(
                    result.reject(`This username is already taken`)
                );
            } else {
                return userDal.findOne({email});
            }
        })
        .then(found => {
            if (found) {
                return Promise.reject(
                    result.reject(`This email is already taken`)
                );
            } else {
                return helper.genSalt();
            }
        })
        .then(salt => helper.hashPassword(password, salt))
        .then(hash => userDal.create({username, email, password: hash}))
        .then(user => result.dataStatus(user, 201, res))
        .catch(reject => result.errorReject(reject, res));
};