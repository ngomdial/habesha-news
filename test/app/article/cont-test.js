'use strict';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const expect = chai.expect;

const app = require('../../../index');

const test = require('./test');
const userTest = require('../user/test');

const data = require('../../config/data');

const Article = require('../../../app/article/model');
const ArticleData = require('../../../app/article-data/model');
const Category = require('../../../app/category/model');
const User = require('../../../app/user/model');
const Comment = require('../../../app/comment/model');

describe('Articles cont.js', () => {
    const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;
    const signUpUserUrl = baseUrl + '/users/signup';
    const articleUrl = baseUrl + '/articles';
    const categoryUrl = baseUrl + '/categories';

    let body;

    before(() => test.deleteAll());

    const username = 'saladthieves', email = 'salad@mail.com', password = 'something_else';

    describe('Post Article Test', () => {

        let postArticle = data => request(app).post(articleUrl).send(data);

        let createCategory = name => request(app).post(categoryUrl).send({name});

        let signUpUser = (username, email, password) =>
            request(app).post(signUpUserUrl).send({username, email, password});

        const headline = 'New flying cars',
            source_url = 'http://somesource.com',
            image_url = 'http://somesource.com/images/headline.jpg',
            summary = 'There is a new list of flying cars in Addis!',
            category = '59e1fb19032cc7284ab7c55a',
            poster = '59e1fb19032cc7284ab7c55c';

        describe('Validate input test', () => {
            it('Should fail validation if headline is missing', done => {
                test.postArticle(' ').end((err, res) => {
                    body = res.body;
                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('headline provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if source_url is missing', done => {
                test.postArticle(undefined, '  ').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('source_url provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if image_url is missing', done => {
                test.postArticle(undefined, undefined, '  ').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('image_url provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if summary is missing', done => {
                test.postArticle(undefined, undefined, undefined, '  ').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('summary provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if category is missing', done => {
                test.postArticle(undefined, undefined, undefined, undefined, '').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('category provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if poster is missing', done => {
                test.postArticle(undefined, undefined, undefined, undefined, undefined, '').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('poster provided');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });
        });

        // TODO: Finish this up
        /*        describe('Article retrieval test', () => {
         });*/

        describe('Article data saving test', () => {
            const create_category_url = baseUrl + '/categories';

            beforeEach(() => test.deleteAll());

            it('Should fail posting if category does not exist', done => {
                test.postArticle().end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains(`Category with _id ${category}`);
                    expect(body).to.have.property('status').equal(404);
                    done();
                });
            });

            it('Should fail posting if the poster does not exist', done => {
                request(app).post(create_category_url).send({name: 'politics'}).end((err, res) => {
                    let category = res.body._id;
                    let data = {headline, source_url, image_url, summary, category, poster};
                    postArticle(data).end((err, res) => {
                        body = res.body;

                        expect(res.status).to.equal(404);
                        expect(body).to.be.a('object');
                        expect(body).to.have.property('error').equal(true);
                        expect(body).to.have.property('message').contains(`User with _id ${poster}`);
                        expect(body).to.have.property('status').equal(404);
                        done();
                    });
                });
            });

            // TODO: Rewrite this test (see the articles comments test for an example)
            it('Should create an article if all data is present', done => {
                // create category first
                createCategory('politics').end((err, res) => {
                    let category = res.body._id;

                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('name').equal('politics');

                    // then create user
                    signUpUser(username, email, password).end((err, res) => {
                        let poster = res.body._id;
                        let data = {headline, source_url, image_url, summary, category, poster};

                        expect(res.status).to.equal(201);
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.have.property('username').equal(username);
                        expect(res.body).to.have.property('email').equal(email);

                        // then create article
                        postArticle(data).end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(201);
                            expect(body).to.be.a('object');
                            expect(body).to.have.property('headline').equal(headline);
                            expect(body).to.have.property('source_url').equal(source_url);
                            expect(body).to.have.property('image_url').equal(image_url);
                            expect(body).to.have.property('summary').equal(summary);
                            expect(body).to.have.property('category').equal(category);
                            expect(body).to.have.property('poster').equal(poster);
                            expect(body).to.have.property('status').equal('pending');
                            expect(body).to.have.property('data').to.have.property('article').equal(body._id);
                            done();
                        });
                    });
                });
            });

            afterEach(() => {
                return Article.remove({}).exec()
                    .then(() => ArticleData.remove({}).exec())
                    .then(() => Category.remove({}).exec())
                    .then(() => User.remove({}).exec());
            });
        });

        describe('Article comments test', () => {
            let user, article, category;
            let articleCommentsUrl;

            before(() => {
                return test.createArticle().then(data => {
                    user = data.user;
                    article = data.article;
                    category = data.category;
                    articleCommentsUrl = data.articleCommentsUrl;
                });
            });

            it('Should retrieve empty comments on a new article', done => {
                test.getArticleComments(articleCommentsUrl).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('array');
                    expect(body).to.be.empty;
                    done();
                });
            });

            it('Should fail to retrieve comments if article does not exist', done => {
                test.getArticleComments(data.articlesUrl + '/' + user._id + '/comments').end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);

                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contains('does not exist');
                    expect(body).to.have.property('status').equal(404);
                    done();
                });
            });

            it('Should retrieve saved comments on a new article', done => {
                let data = {
                    data: article.data,
                    message: 'This is a cool new article message!',
                    poster: user
                };
                request(app).post(articleCommentsUrl).send(data).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(201);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('message').equal(data.message);
                    request(app).get(articleCommentsUrl).end((err, res) => {
                        body = res.body;

                        expect(res.status).to.equal(200);
                        expect(body).to.be.a('array');
                        expect(body).to.have.lengthOf(1);
                        done();
                    });
                });
            });

            after(() => test.deleteAll());
        });

        describe('Article followers test', () => {

            let user, article, category;
            let singleArticleUrl, articleUrl, followersUrl, followUrl, unfollowUrl;

            before(() => {
                return Article.remove({}).exec()
                    .then(() => ArticleData.remove({}).exec())
                    .then(() => Category.remove({}).exec())
                    .then(() => User.remove({}).exec())
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
                        return request(app).post(baseUrl + '/articles').send(data);
                    })
                    .then(res => {
                        article = res.body;

                        articleUrl = baseUrl + '/articles';
                        singleArticleUrl = articleUrl + '/' + article._id;
                        followersUrl = singleArticleUrl + '/followers';
                        followUrl = singleArticleUrl + '/follow';
                        unfollowUrl = singleArticleUrl + '/unfollow';
                    });
            });

            it('Should fail to follow article if article-data does not exist', done => {
                request(app).post(articleUrl + '/' + user._id + '/follow').send({user}).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').to.equal(true);
                    expect(body).to.have.property('message').contain('does not exist');
                    expect(body).to.have.property('status').to.equal(404);
                    done();
                });
            });

            it('Should fail to unfollow article if article-data does not exist', done => {
                request(app).post(articleUrl + '/' + user._id + '/unfollow').send({user}).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').to.equal(true);
                    expect(body).to.have.property('message').contain('does not exist');
                    expect(body).to.have.property('status').to.equal(404);
                    done();
                });
            });
        });
    });

    after(() => {
        return Article.remove({}).exec()
            .then(() => ArticleData.remove({}).exec())
            .then(() => Category.remove({}).exec())
            .then(() => User.remove({}).exec());
    });
});