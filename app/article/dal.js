'use strict';

const Article = require('./model');

exports.create = data => new Article(data).save();

exports.update = article => article.save();

exports.findOne = query => Article.findOne(query).populate('poster category data').exec();

exports.findAll = () => Article.find().exec();