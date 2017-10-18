'use strict';

const Warning = require('./model');

exports.create = (data, message, poster) => new Warning({data, message, poster}).save();

exports.findOne = query => Warning.findOne(query).exec();

exports.findAll = () => Warning.find().exec();