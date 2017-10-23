'use strict';

const Category = require('./category-model');

exports.create = data => new Category(data).save();

exports.findOne = query => Category.findOne(query).exec();

exports.findAll = query => Category.find(query).exec();