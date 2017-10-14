'use strict';

const Article = require('./model');

exports.create = data => new Article(data).save();

exports.findOne = query => Article.findOne(query).populate('article', 'poster', 'data').exec();

exports.findAll = () => Article.find().exec();