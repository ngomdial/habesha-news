'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');
const helper = require('../../util/helper');

const articleDal = require('../article/dal');
const articleDataDal = require('./dal');
const userDal = require('../user/dal');
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
    let data = req.articleData, follower;
    validator.hasFollowFields(req)
        .then(user => {
            follower = user;
            return userDal.findOne({_id: follower});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${follower} does not exist`, 404)
                );
            } else {
                if (helper.containsId(found, data.followers)) {
                    return Promise.reject(result.rejectStatus(
                        `User with _id ${follower} is already following Article with _id ${data.article}`, 400)
                    );
                } else {
                    data.followers.push(found);
                    return data.save();
                }
            }
        })
        .then(() => {
            result.messageStatus(`User with _id ${follower} has been added as a follower`, 201, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.unfollow = (req, res) => {
    let data = req.articleData, follower;
    validator.hasFollowFields(req)
        .then(user => {
            follower = user;
            return userDal.findOne({_id: follower})
        })
        .then(found => {
            if (!found) {
                return Promise.reject(
                    result.rejectStatus(`User with _id ${follower} does not exist`, 404)
                );
            } else {
                if (helper.containsId(found, data.followers)) {
                    data.followers.pull(found);
                    return data.save();
                } else {
                    return Promise.reject(
                        result.rejectStatus(`User with _id ${follower} is not following Article with _id ${data.article}`,
                            400)
                    );
                }
            }
        })
        .then(() => {
            result.messageStatus(`User with _id ${follower} has been removed as a follower`, 200, res);
        })
        .catch(reject => result.errorReject(reject, res));
};

exports.getVotes = (req, res) => {
    let data = req.articleData;
    result.data(data.voters, res);
};

exports.addVote = (req, res) => {
    let data = req.articleData, user;
    validator.hasVoteFields(req)
        .then(body => {
            user = body.user;
            return userDal.findOne({_id: user});
        })
        .then(found => {
            if (!found) {
                return Promise.reject(result.rejectStatus(`User with _id ${user} does not exist`, 404));
            } else {
                return articleDal.findOne({_id: data.article});
            }
        })
        .then(found => {
            const status = found.status;
            if (status === 'failed') {
                return Promise.reject(result.rejectStatus(
                    `Article with _id ${found._id} cannot be voted on as it has failed`, 400
                ));
            } else {
                const votes = data.voters.length;
                if (voters >= 10) {
                    return Promise.reject(result.rejectStatus(
                        `Article with _id ${data.article} already has a max of 10 votes to be approved`, 400
                    ));
                } else {
                    if (helper.containsId(found, data.voters)) {
                        return Promise.reject(result.rejectStatus(
                            `User with _id ${user} has already voted on Article with _id ${data.article}`, 400
                        ));
                    } else {
                        data.voters.push(found);
                        return articleDataDal.update(data);
                    }
                }
            }
        })
        .then(updated => {

            if (updated.voters.length === 10) {
                return articleDal.findOne({_id: data.article})
                    .then(article => {
                        article.status = 'approved';
                        return articleDal.update(article);
                    });
            }
            result.dataStatus(updated, 201, res);
        })
        .catch(reject => result.errorReject(reject, res));
};