'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const url = process.env.DATABASE_URL;

mongoose
    .connect(url, {useMongoClient: true})
    .then(() => {})
    .catch(err => console.error('Database connection failed', err));