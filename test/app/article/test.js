'use strict';

const request = require('supertest');
const Promise = require('bluebird');

const articleConfig = require('./config');
const articleDataConfig = require('../article-data/config');
const categoryConfig = require('../category/config');
const userConfig = require('../user/config');
const commentConfig = require('../comment/config');

const userTest = require('../user/test');
const categoryTest = require('../category/test');

const app = require('../../../index');
const base_data = require('../../config/data');

const {headline, source_url, image_url, summary, articlesUrl, categoriesUrl} = base_data;

exports.deleteAll = () => {
    return articleConfig.deleteAll()
        .then(() => articleDataConfig.deleteAll())
        .then(() => categoryConfig.deleteAll())
        .then(() => userConfig.deleteAll())
        .then(() => commentConfig.deleteAll());
};

exports.postArticle = (headline = base_data.headline, source_url = base_data.source_url,
                       image_url = base_data.image_url, summary = base_data.summary,
                       category = base_data.category, poster = base_data.poster) => {
    return request(app).post(articlesUrl)
        .send({headline, source_url, image_url, summary, category, poster});
};

exports.getArticleComments = url => {
    return request(app).get(url);
};

exports.postArticleComment = (url, data, message = base_data.comment_message, poster) => {
    return request(app).post(url).send({data, message, poster});
};

exports.createArticle = () => {
    let user, category, article;
    let articleCommentsUrl = base_data.articlesUrl;
    return this.deleteAll()
        .then(() => userTest.signUp())
        .then(data => {
            user = data.body;
            return categoryTest.createCategory();
        })
        .then(data => {
            category = data.body;
            return this.postArticle(undefined, undefined, undefined, undefined, category, user)
        })
        .then(data => {
            article = data.body;
            articleCommentsUrl += '/' + article._id + '/comments';
            return Promise.resolve({user, article, category, articleCommentsUrl});
        });
};