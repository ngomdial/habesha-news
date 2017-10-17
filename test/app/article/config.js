'use strict';

const Article = require('../../../app/article/model');

exports.deleteAll = () => Article.remove({}).exec();