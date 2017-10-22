'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const User = require('../../app/user/user-model');
const dal = require('../../app/user/user-dal');

const {username, email, password, usersUrl, usersSignUpUrl, usersLoginUrl} = data.data;

exports.deleteAll = () => User.remove({}).exec();

exports.signUp = (u = username, e = email, p = password) => {
    return request(app).post(usersSignUpUrl).send({username: u, email: e, password: p});
};

exports.login = (u = username, p = password) => {
    return request(app).post(usersLoginUrl).send({username: u, password: p});
};

exports.findAll = () => {
    return request(app).get(usersUrl);
};

exports.findOne = id => {
    return request(app).get(usersUrl + '/' + id);
};