'use strict';

const request = require('supertest');

const User = require('../../../app/user/model');

const app = require('../../../index');
const data = require('../../config/data');

const {loginUrl, signUpUrl} = data;

exports.deleteAll = () => User.remove({}).exec();

exports.signUp = (username = data.username, email = data.email, password = data.password) => {
    return request(app).post(signUpUrl).send({username, email, password});
};

exports.login = (username = data.username, password = data.password) => {
    return request(app).post(loginUrl).send({username, password});
};