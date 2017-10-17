'use strict';

const User = require('../../../app/user/model');

exports.deleteAll = () => User.remove({}).exec();