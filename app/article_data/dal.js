'use strict';

const ArticleData = require('./model');

exports.findOne = query => ArticleData.findOne(query).populate('comments', 'followers', 'warnings', 'voters');

exports.findAll = () => ArticleData.find().exec();