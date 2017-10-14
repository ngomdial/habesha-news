'use strict';

const ArticleData = require('./model');

exports.create = article => new ArticleData({article}).save();

exports.findOne = query => ArticleData.findOne(query).populate('comments', 'followers', 'warnings', 'voters');

exports.findAll = () => ArticleData.find().exec();