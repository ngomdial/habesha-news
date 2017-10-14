'use strict';

const Profile = require('./model');

exports.create = user_id => new Profile({user: user_id}).save();

exports.findOne = query => Profile.findOne(query).populate('article').exec();

exports.findAll = () => Profile.find().exec();