'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const env = process.env.NODE_ENV;
let url = process.env.DATABASE_URL;
if (env === 'test') {
    url += '_test';
}

mongoose.plugin(require('mongoose-hidden')({
    defaultHidden: {'_id': false, password: true, pin: true, '__v': true}
}));

const connect = (databaseUrl = url) => {
    return mongoose
        .connect(databaseUrl, {useMongoClient: true})
        .then(() => {
            console.log('Database connect');
            if (env === 'test') console.log(`Using test db: ${databaseUrl}`);
        })
        .catch(err => console.error('Database connection failed', err));
};

connect();

module.exports = connect;