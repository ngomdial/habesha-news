'use strict';

const Category = require('../../../app/category/model');

exports.deleteAll = () => Category.remove({}).exec();