'use strict';

const profileDal = require('./dal');

const Promise = require('bluebird');
const result = require('../../util/res');
const log = require('../../util/log');

exports.findAll = (req, res) => {
    profileDal.findAll()
        .then(profiles => {
            result.data(profiles, res);
        })
        .catch(reject => {
            result.errorReject(reject, res);
        });
};

exports.validateOne = (req, res, next, profileId) => {
    profileDal.findOne({_id: profileId})
        .then(profile => {
            if (profile) {
                req.profile = profile;
                next();
            } else {
                result.errorStatus(`Profile with _id ${profileId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.profile, res);
