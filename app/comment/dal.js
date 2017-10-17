'use strict';

const Comment = require('./model');

exports.create = data => new Comment(data).save();

exports.findOne = query => Comment.findOne(query).populate('likes dislikes').exec();

exports.findAll = () => Comment.find().exec();

exports.findAllBy = query => Comment.find(query).populate('likes dislikes').exec();