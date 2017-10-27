'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const commentDal = require('../../app/comment/comment-dal');

const Comment = require('../../app/comment/comment-model');

const {commentMessage, commentsUrl, likesCommentUrl, dislikesCommentUrl} = data.data;

exports.deleteAll = () => Comment.remove({}).exec();

exports.create = (poster, article, message = commentMessage) => {
    return request(app).post(commentsUrl).send({article, poster, message});
};

exports.resetLikes = comment => {
    return commentDal.findOne({_id: comment})
        .then(found => {
            found.likes = [];
            return commentDal.update(found);
        });
};

exports.resetDislikes = comment => {
    return commentDal.findOne({_id: comment})
        .then(found => {
            found.dislikes = [];
            return commentDal.update(found);
        });
};

exports.findLikes = comment => {
    return request(app).get(commentsUrl + '/' + comment + likesCommentUrl);
};

exports.findDislikes = comment => {
    return request(app).get(commentsUrl + '/' + comment + dislikesCommentUrl);
};

exports.like = (comment, user) => {
    return request(app).post(commentsUrl + '/' + comment + likesCommentUrl).send({user});
};

exports.dislike = (comment, user) => {
    return request(app).post(commentsUrl + '/' + comment + dislikesCommentUrl).send({user});
};

exports.findAll = () => request(app).get(commentsUrl);

exports.findOne = id => request(app).get(commentsUrl + '/' + id);