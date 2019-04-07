'use strict';

const Promise = require('bluebird');

const result = require('../../util/res');
const helper = require('../../util/helper');
const constants = require('../../util/constants');

const articleDal = require('./article-dal');
const userDal = require('../user/user-dal');
const categoryDal = require('../category/category-dal');

const validator = require('./article-validator');

exports.create = (req, res) => {
  let headline, source_url, image_url, summary, poster, category;
  validator.hasRequiredFields(req)
    .then(body => {
      headline = body.headline;
      source_url = body.source_url;
      image_url = body.image_url;
      summary = body.summary;
      poster = body.poster;
      category = body.category;
      return userDal.findOne({_id: poster});
    })
    .then(found => {
      if (!found) {
        return Promise.reject(
          result.rejectStatus(`User with _id ${poster} does not exist`, 404)
        );
      } else {
        return categoryDal.findOne({_id: category});
      }
    })
    .then(found => {
      if (!found) {
        return Promise.reject(
          result.rejectStatus(`Category with _id ${category} does not exist`, 404)
        );
      } else {
        return articleDal.create({
          headline, source_url, image_url, summary, poster, category
        });
      }
    })
    .then(article => result.dataStatus(article, 201, res))
    .catch(reject => result.errorReject(reject, res));
};

exports.findVoters = (req, res) => {
  let article = req.article;
  result.data(article.voters, res);
};

exports.vote = (req, res) => {
  applyVoteUnVote(req, res);
};

exports.unVote = (req, res) => {
  applyVoteUnVote(req, res, false);
};

const applyVoteUnVote = (req, res, vote = true) => {
  let user, article = req.article;
  let votes = article.voters.length;
  validator.hasVoteUnVoteFields(req)
    .then(body => {
      user = body.user;
      return userDal.findOne({_id: user});
    })
    .then(found => {
      if (!found) {
        return Promise.reject(
          result.rejectStatus(`User with _id ${user} does not exist`, 404)
        );
      } else {
        user = found;
        if (article.status === constants.statuses.failed) {
          return Promise.reject(
            result.reject(
              `Cannot vote on this article as it has already failed`
            )
          );
        }
        if (article.status === constants.statuses.approved) {
          return Promise.reject(
            result.reject(
              `Cannot vote on this article as it has already been approved`
            )
          );
        }
        if (vote) {
          if (helper.containsId(user, article.voters)) {
            return Promise.reject(
              result.reject(`User with _id ${user._id} has already voted on this Article`)
            );
          } else {
            article.voters.push(user._id);
            votes++;
            return articleDal.update(article);
          }
        } else {
          if (!helper.containsId(user, article.voters)) {
            return Promise.reject(
              result.reject(`User with _id ${user._id} has not voted on this Article`)
            );
          } else {
            article.voters.pull(user._id);
            votes--;
            return articleDal.update(article);
          }
        }
      }
    })
    .then(() => {
      if (votes >= constants.MAX_APPROVAL_COUNT) {
        article.status = constants.statuses.approved;
        return articleDal.update(article);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      result.messageStatus(`User with _id ${user._id} has ${vote ? 'voted' : 'unvoted'} on this Article`, 201, res);
    })
    .catch(reject => result.errorReject(reject, res));
};

exports.findFollowers = (req, res) => {
  let article = req.article;
  result.data(article.followers, res);
};

exports.follow = (req, res) => {
  applyFollowUnFollow(req, res);
};

exports.unFollow = (req, res) => {
  applyFollowUnFollow(req, res, false);
};

const applyFollowUnFollow = (req, res, follow = true) => {
  let user, article = req.article;
  validator.hasFollowUnFollowFields(req)
    .then(body => {
      user = body.user;
      return userDal.findOne({_id: user});
    })
    .then(found => {
      if (!found) {
        return Promise.reject(
          result.rejectStatus(`User with _id ${user} does not exist`, 404)
        );
      } else {
        user = found;
        if (article.status === constants.statuses.failed) {
          return Promise.reject(
            result.reject(
              `Cannot ${follow ? 'follow' : 'unfollow'} this article as it has failed`
            )
          );
        }
        if (article.status === constants.statuses.pending) {
          return Promise.reject(
            result.reject(
              `Cannot ${follow ? 'follow' : 'unfollow'} this article as it is pending`
            )
          );
        }
        if (follow) {
          if (helper.containsId(user, article.followers)) {
            return Promise.reject(
              result.reject(`User with _id ${user._id} is already following this Article`)
            );
          } else {
            article.followers.push(user._id);
            return articleDal.update(article);
          }
        } else {
          if (!helper.containsId(user, article.followers)) {
            return Promise.reject(
              result.reject(`User with _id ${user._id} is not following this Article`)
            );
          } else {
            article.followers.pull(user._id);
            return articleDal.update(article);
          }
        }
      }
    })
    .then(() => {
      result.messageStatus(`User with _id ${user._id} is ${follow ? 'now' : 'no longer'} following this Article`, 201, res);
    })
    .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, id) => {
  articleDal.findOne({_id: id})
    .then(article => {
      if (!article) {
        result.errorStatus(`Article with _id ${id} does not exist`, 404, res);
      } else {
        req.article = article;
        next();
      }
    });
};

exports.findOne = (req, res) => {
  result.data(req.article, res);
};

exports.findAll = (req, res) => {
  articleDal.findAll()
    .then(articles => {
      result.data(articles, res);
    });
};