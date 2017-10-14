'use strict';

const Category = require('./model');

exports.create = data => new Category(data).save();

exports.findOne = query => Category.findOne(query).exec();

exports.findAll = () => Category.find().exec();