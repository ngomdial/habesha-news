'use strict';

const User = require('./model');
const result = require('../../util/res');
const Promise = require('bluebird');

exports.create = (username, email, password) => {
    return new User({username, email, password}).save();
};

exports.update = user => {
    console.log(user);
    return user.save();
};

exports.findOne = query => {
    return User
        .findOne(query)
        .populate('profile')
        .exec();
};

exports.findAll = () => {
    return User
        .find()
        .exec();
};