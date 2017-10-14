'use strict';

const ArticleData = require('./model');

exports.create = article_id => new ArticleData({article: article_id}).save();

exports.findOne = query => ArticleData.findOne(query).populate('comments followers warnings voters').exec();

exports.findAll = () => ArticleData.find().exec();