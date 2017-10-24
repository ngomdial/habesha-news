'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Comment = require('../../app/comment/comment-model');

const {commentMessage, commentsUrl} = data.data;

exports.deleteAll = () => Comment.remove({}).exec();

exports.create = (poster, article, message = commentMessage) => {
    return request(app).post(commentsUrl).send({article, poster, message});
};

exports.findAll = () => request(app).get(commentsUrl);

exports.findOne = id => request(app).get(commentsUrl + '/' + id);