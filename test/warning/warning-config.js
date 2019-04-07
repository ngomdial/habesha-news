'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Warning = require('../../app/warning/warning-model');

const {warningsUrl, warningMessage} = data.data;

exports.deleteAll = () => Warning.remove({}).exec();

exports.create = (poster, article, message = warningMessage) => {
    return request(app).post(warningsUrl).send({poster, article, message});
};

exports.findAll = () => request(app).get(warningsUrl);

exports.findOne = id => request(app).get(warningsUrl + '/' + id);