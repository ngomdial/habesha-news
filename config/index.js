'use strict';

const mongoose = require('mongoose');
mongoose.plugin(require('mongoose-hidden')({
    defaultHidden: {'_id': false, password: true, pin: true, '__v': true}
}));
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DATABASE_URL);