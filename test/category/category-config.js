'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Category = require('../../app/category/category-model');
const dal = require('../../app/category/category-dal');

const {categoriesUrl} = data.data;

exports.deleteAll = () => Category.remove({}).exec();

exports.create = data => request(app).post(categoriesUrl).send(data);

exports.findAll = () => request(app).get(categoriesUrl);

exports.findOne = id => request(app).get(categoriesUrl + '/' + id);