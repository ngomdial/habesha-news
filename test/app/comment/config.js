'use strict';

const Comment = require('../../../app/comment/model');

exports.deleteAll = () => Comment.remove({}).exec();