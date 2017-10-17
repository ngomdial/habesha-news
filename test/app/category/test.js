'use strict';

const request = require('supertest');

const data = require('../../config/data');
const app = require('../../../index');

const {category_name, categoriesUrl} = data;

exports.createCategory = (name = data.category_name) => {
    return request(app).post(categoriesUrl).send({name});
};