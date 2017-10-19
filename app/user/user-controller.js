'use strict';

const Promise = require('bluebird');
const result = require('../../util/res');
const helper = require('../../util/helper');

const userDal = require('./user-dal');

const validator = require('./user-validator');

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
                    result.reject(`Username '${username}' is already taken`)
                );
            } else {
                return userDal.findOne({email});
            }
        })
        .then(found => {
            if (found) {
                return Promise.reject(
                    result.reject(`Email '${email}' is already taken`)
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