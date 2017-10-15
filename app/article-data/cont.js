'use strict';

const result = require('../../util/res');
const articleDataDal = require('./dal');
const userDal = require('../user/dal');
const Promise = require('bluebird');
const validator = require('../article/validator');

const ArticleData = require('../article-data/model');

exports.findAll = (req, res) => {
    articleDataDal.findAll()
        .then(data => result.data(data, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, dataId) => {
    articleDataDal
        .findOne({_id: dataId})
        .then(data => {
            if (data) {
                req.articleData = data;
                next();
            } else {
                result.errorStatus(`ArticleData with _id ${dataId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.articleData, res);

exports.findFollowers = (req, res) => {
    result.data(req.articleData.followers, res);
};

exports.getFollowers = dataId => {
    return articleDataDal
        .findOne({_id: dataId})
        .then(data => {
            if (!data) {
                return Promise.reject(result.reject(`ArticleData with _id ${dataId} does not exist`));
            } else {
                return Promise.resolve(data);
            }
        })
        .catch(error => Promise.reject(result.reject(error)));
};

exports.follow = (req, res) => {
    let data = req.articleData;
    let follower;
    validator.hasFollowFields(req)
        .then(user => {
            follower = user;
            return userDal.findOne({_id: follower})
        })
        .then(found => {
            if (!found) {
                result.errorStatus(`User with _id ${follower} does not exist`, 404, res);
            } else {
                let followers = data.followers, following = false;
                if (followers.length !== 0) {
                    for (let i = 0; i < followers.length; i++) {
                        let follower = followers[i];
                        if (follower._id.equals(found._id)) {
                            following = true;
                            break;
                        }
                    }
                }

                if (following) {
                    result.errorStatus(
                        `User with _id ${follower} is already following Article with _id ${data.article}`,
                        400, res
                    );
                } else {
                    data.followers.push(follower);
                    return data.save();
                }
            }
        })
        .then(updated => {
            result.data(updated, res);
        })
        .catch(reject => result.errorReject(reject, res));
};