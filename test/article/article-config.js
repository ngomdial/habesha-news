'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Article = require('../../app/article/article-model');

const {articlesUrl, articleHeadline, sourceUrl, imageUrl, articleSummary} = data.data;

exports.deleteAll = () => Article.remove({}).exec();

exports.create = (headline = articleHeadline, source_url = sourceUrl,
                  image_url = imageUrl, summary = articleSummary, poster, category) => {
    return request(app).post(articlesUrl).send({headline, source_url, image_url, summary, poster, category});
};

exports.createArticle = (poster, category) => {
    return request(app).post(articlesUrl).send({
            headline: articleHeadline, source_url: sourceUrl,
            image_url: imageUrl, summary:articleSummary, poster, category
        }
    );
};

exports.findAll = () => request(app).get(articlesUrl);

exports.findOne = id => request(app).get(articlesUrl + '/' + id);