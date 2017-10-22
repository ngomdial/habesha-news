'use strict';

const User = require('./user-model');

exports.create = data => new User(data).save();

exports.findOne = query => User.findOne(query).exec();

exports.findAll = query => User.find(query).exec();