'use strict';

const Warning = require('./warning-model');

exports.create = data => new Warning(data).save();

exports.findOne = query => Warning.findOne(query).exec();

exports.findAll = query => Warning.find(query).exec();