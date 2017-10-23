'use strict';

const Article = require('./article-model');

exports.create = data => new Article(data).save();

exports.findAll = query => Article.find(query).exec();

exports.findOne = query => Article.findOne(query).exec();