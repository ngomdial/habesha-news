'use strict';

const ArticleData = require('../../../app/article-data/model');

exports.deleteAll = () => ArticleData.remove({}).exec();