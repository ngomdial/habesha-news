'use strict';

const Comment = require('./comment-model');

exports.create = data => new Comment(data).save();

exports.update = comment => comment.save();

exports.findOne = query => Comment.findOne(query).exec();

exports.findAll = query => Comment.find(query).exec();