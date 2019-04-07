'use strict';

const Profile = require('./profile-model');

exports.create = data => new Profile(data).save();

exports.findOne = query => Profile.findOne(query).exec();

exports.findAll = query => Profile.find(query).exec();