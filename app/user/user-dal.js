'use strict';

const User = require('./user-model');

exports.create = data => new User(data).save();

exports.update = (user, data) => {
    Object.assign(user, data);
    return user.save();
};

exports.findOne = query => User.findOne(query).populate('profile').exec();

exports.findAll = query => User.find(query).exec();