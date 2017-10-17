'use strict';

const request = require('supertest');

const userConfig = require('./config');
const profileConfig = require('../profile/config');

const app = require('../../../index');
const data = require('../../config/data');

const {loginUrl, signUpUrl} = data;

exports.deleteAll = () => userConfig.deleteAll().then(() => profileConfig.deleteAll());

exports.signUp = (username = data.username, email = data.email, password = data.password) => {
    return request(app).post(signUpUrl).send({username, email, password});
};

exports.login = (username = data.username, password = data.password) => {
    return request(app).post(loginUrl).send({username, password});
};