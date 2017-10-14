'use strict';

const Category = require('./model');

exports.findOne = query => Category.findOne(query).exec();

exports.findAll = () => Category.find().exec();