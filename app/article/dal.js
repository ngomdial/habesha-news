'use strict';

const Article = require('./model');

exports.findOne = query => Article.findOne(query).populate('article', 'poster', 'data').exec();

exports.findAll = () => Article.find().exec();