'use strict';

const Profile = require('./model');
const result = require('../../util/res');
const Promise = require('bluebird');

exports.create = user_id => new Profile({user: user_id}).save();

exports.findOne = query => Profile.findOne(query).exec();

exports.findAll = () => Profile.find().exec();