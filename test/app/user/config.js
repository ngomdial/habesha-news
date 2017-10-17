'use strict';

const userConfig = require('./test');
const profileConfig = require('../profile/config');

exports.deleteAll = () => userConfig.deleteAll().then(() => profileConfig.deleteAll());