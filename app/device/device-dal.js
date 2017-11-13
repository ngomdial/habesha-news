'use strict';

const Device = require('./device-model');

exports.create = data => new Device(data).save();

exports.findOne = query => Device.findOne(query).exec();

exports.findAll = query => Device.find(query).exec();