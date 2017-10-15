'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let url = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
    url += '_test';
}

mongoose.plugin(require('mongoose-hidden')({
    defaultHidden: {'_id': false, password: true, pin: true, '__v': true}
}));
mongoose
    .connect(url, {useMongoClient: true})
    .then(() => console.log('Database connection established'))
    .catch(err => console.error('Database connection failed', err));