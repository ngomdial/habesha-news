'use strict';

const Warning = require('./model');

exports.findOne = query => Warning.findOne(query).exec();

exports.findAll = () => Warning.find().exec();