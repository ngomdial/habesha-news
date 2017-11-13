'use strict';

const Promise = require('bluebird');
const result = require('../../util/res');
const helper = require('../../util/helper');

const deviceDal = require('./device-dal');
const userDal = require('../user/user-dal');

const validator = require('./device-validator');

exports.create = (req, res) => {
    let user, token;
    validator.hasRequiredFields(req)
        .then(body => {
            user = body.user;
            token = body.token;
            return userDal.findOne({_id: user});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${user} does not exist`, 404)
                );
            } else {
                return deviceDal.findOne({token});
            }
        })
        .then(found => {
            if (found) {
                return Promise.reject(
                    result.reject(`Device with token ${token} already exists`)
                );
            } else {
                return deviceDal.create({user, token});
            }
        })
        .then(device => result.dataStatus(device, 201, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.remove = (req, res) => {
    const device = req.device;
    deviceDal.remove({_id: device._id})
        .then(removed => {
            result.message(`Device with _id ${device._id} has been removed`, res);
        });
};

exports.validateOne = (req, res, next, id) => {
    deviceDal.findOne({_id: id})
        .then(device => {
            if (!device) {
                result.errorStatus(`Device with _id ${id} does not exist`, 404, res);
            } else {
                req.device = device;
                next();
            }
        });
};

exports.findOne = (req, res) => {
    result.data(req.device, res);
};

exports.findAll = (req, res) => {
    deviceDal.findAll()
        .then(devices => result.data(devices, res));
};