'use strict';

const Comment = require('./model');

exports.findOne = query => Comment.findOne(query).exec();

exports.findAll = () => Comment.find().exec();