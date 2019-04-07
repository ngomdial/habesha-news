'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Device = require('../../app/device/device-model');
const deviceDal = require('../../app/device/device-dal');

const {token, devicesUrl} = data.data;

exports.deleteAll = () => Device.remove({}).exec();

exports.create = (user, t = token) => {
    return request(app).post(devicesUrl).send({user, token: t});
};

exports.remove = id => request(app).delete(devicesUrl + '/' + id);

exports.findAll = () => request(app).get(devicesUrl);

exports.findOne = id => request(app).get(devicesUrl+ '/' + id);