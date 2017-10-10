'use strict';

const User = require('./model');
const result = require('../../util/res');
const Promise = require('bluebird');

exports.findOne = query => {
    return User
        .findOne(query)
        .exec();
};

exports.findAll = () => {
    return User
        .find()
        .exec();
};