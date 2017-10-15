'use strict';

const Comment = require('./model');

exports.create = data => new Comment(data).save();

exports.findOne = query => Comment.findOne(query).exec();

exports.findAll = () => Comment.find().exec();

exports.findAllBy = query => Comment.find(query).exec();