'use strict';

const profileDal = require('./profile-dal');

const result = require('../../util/res');

exports.findAll = (req, res) => {
    return profileDal.findAll()
        .then(profiles => {
            result.data(profiles, res);
        });
};

exports.validateOne = (req, res, next, id) => {
    profileDal.findOne({_id: id})
        .then(profile => {
            if (!profile) {
                result.error(`Profile with _id ${id} does not exist`, res);
            } else {
                req.profile = profile;
                next();
            }
        });
};

exports.findOne = (req, res) => {
    result.data(req.profile, res);
};