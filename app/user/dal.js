'use strict';

const User = require('./model');
const result = require('../../util/res');
const Promise = require('bluebird');

exports.create = (username, email, password) => new User({username, email, password}).save();

exports.update = user => user.save();

exports.findOne = query => User.findOne(query).populate('profile').exec();

exports.findAll = () => User.find().exec();