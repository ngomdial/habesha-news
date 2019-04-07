'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Article = require('../../app/article/article-model');
const articleDal = require('../../app/article/article-dal');

const {articlesUrl, articleHeadline, sourceUrl, imageUrl, articleSummary, followersUrl, votersUrls} = data.data;

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

exports.updateStatus = (id, status) => {
    return articleDal.findOne({_id: id}).then(article => {
        article.status = status;
        return articleDal.update(article);
    });
};

exports.resetFollowers = id => {
    return articleDal.findOne({_id: id}).then(article => {
        article.followers = [];
        return articleDal.update(article);
    });
};

exports.findFollowers = article => {
    return request(app).get(articlesUrl + '/' + article + followersUrl);
};

exports.follow = (article, user) => {
    return request(app).post(articlesUrl + '/' + article + followersUrl).send({user});
};

exports.unFollow = (article, user) => {
    return request(app).delete(articlesUrl + '/' + article + followersUrl).send({user});
};

exports.findVoters = article => {
    return request(app).get(articlesUrl + '/' + article + votersUrls);
};

exports.resetVoters = id => {
    return articleDal.findOne({_id: id}).then(article => {
        article.voters = [];
        return articleDal.update(article);
    });
};

exports.vote = (article, user) => {
    return request(app).post(articlesUrl + '/' + article + votersUrls).send({user});
};

exports.unVote = (article, user) => {
    return request(app).delete(articlesUrl + '/' + article + votersUrls).send({user});
};

exports.findAll = () => request(app).get(articlesUrl);

exports.findOne = id => request(app).get(articlesUrl + '/' + id);