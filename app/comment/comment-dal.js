'use strict';

const Comment = require('./comment-model');

exports.create = data =>

exports.findOne = query => Comment.findOne(query).exec();

exports.getAll = query => Comment.find(query).exec();