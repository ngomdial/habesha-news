'use strict';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const expect = chai.expect;

const app = require('../../../index');

const Article = require('../../../app/article/model');
const ArticleData = require('../../../app/article-data/model');
const Category = require('../../../app/category/model');
const User = require('../../../app/user/model');
const Comment = require('../../../app/comment/model');

const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;
const signUpUserUrl = baseUrl + '/users/signup';
const articleUrl = baseUrl + '/articles';
const categoryUrl = baseUrl + '/categories';
const commentsUrl = baseUrl + '/comments';

const username = 'saladthieves', email = 'salad@mail.com', password = 'something_else';

const headline = 'New flying cars',
    source_url = 'http://somesource.com',
    image_url = 'http://somesource.com/images/headline.jpg',
    summary = 'There is a new list of flying cars in Addis!',
    category = '59e1fb19032cc7284ab7c55a',
    poster = '59e1fb19032cc7284ab7c55c';

describe('comment cont.js', () => {
    let body;
    let user, article, category;

    before(() => {
        return Article.remove({}).exec()
            .then(() => ArticleData.remove({}).exec())
            .then(() => Category.remove({}).exec())
            .then(() => User.remove({}).exec())
            .then(() => Comment.remove({}).exec())
            .then(() => {
                return request(app).post(signUpUserUrl).send({username, email, password});
            })
            .then(res => {
                user = res.body;
                return request(app).post(categoryUrl).send({name: 'politics'});
            })
            .then(res => {
                category = res.body;
                let data = {headline, source_url, image_url, summary, category, poster: user};
                return request(app).post(articleUrl).send(data);
            })
            .then(res => {
                article = res.body;
            });
    });

    describe('Validate input test', () => {
        let data = {};

        it('Should fail validation if req.body is empty', done => {
            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('provided');
                done();
            });
        });

        it('Should fail validation if data attribute is missing', done => {
            let data = {
                message: 'This is a cool new article message!',
                poster: user
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('provided');
                done();
            });
        });

        it('Should fail validation if poster attribute is missing', done => {
            let data = {
                data: article._id,
                message: 'This is a cool new article message!'
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('provided');
                done();
            });
        });
    });

    describe('Comment saving test', () => {
        let data = {};

        beforeEach(() => Comment.remove({}).exec());

        it('Should fail to post a comment if user does not exist', done => {
            data = {
                data: article._id,
                message: 'This is a cool new article message',
                poster: article._id
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('not exist');
                done();
            });
        });

        it('Should fail to post a comment if data article does not exist', done => {
            data = {
                data: user._id,
                message: 'This is a cool new article message',
                poster: user._id
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('not exist');
                done();
            });
        });

        it('Should post a comment if all data is valid', done => {
            data = {
                data: article.data._id,
                message: 'This is a cool new article message',
                poster: user._id
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(201);
                expect(body).to.be.a('object');
                expect(body).to.have.property('data').equal(data.data);
                expect(body).to.have.property('message').equal(data.message);
                expect(body).to.have.property('poster').equal(data.poster);
                done();
            });
        });

        afterEach(() => Comment.remove({}).exec());
    });

    describe('Comment retrieval test', () => {
        beforeEach(() => Comment.remove({}).exec());

        it('Should retrieve empty comments when nothing saved', done => {
            request(app).get(commentsUrl).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.be.empty;
                done();
            });
        });

        it('Should retrieve saved comments', done => {
            let data = {
                data: article.data._id,
                message: 'This is a cool new article message',
                poster: user._id
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                expect(res.status).to.equal(201);
                request(app).get(commentsUrl).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('array');
                    expect(body).to.have.lengthOf(1);
                    expect(body[0]).to.have.property('message').equal(data.message);
                    expect(body[0]).to.have.property('poster').equal(data.poster);
                    done();
                });
            });
        });

        it('Should retrieve a single saved comment', done => {
            let data = {
                data: article.data._id,
                message: 'This is a cool new article message',
                poster: user._id
            };

            request(app).post(commentsUrl).send(data).end((err, res) => {
                expect(res.status).to.equal(201);
                let comment = res.body;

                request(app).get(commentsUrl + '/' + comment._id).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('message').equal(data.message);
                    expect(body).to.have.property('poster').equal(data.poster);
                    expect(body).to.have.property('data').equal(data.data);
                    done();
                });
            });
        });

        afterEach(() => Comment.remove({}).exec());
    });
});