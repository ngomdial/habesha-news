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

const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;
const signUpUserUrl = baseUrl + '/users/signup';
const articleUrl = baseUrl + '/articles';
const categoryUrl = baseUrl + '/categories';

let singleArticleDataUrl, articleDataUrl, followersUrl, followUrl, unfollowUrl;

const username = 'saladthieves', email = 'salad@mail.com', password = 'something_else';

const headline = 'New flying cars',
    source_url = 'http://somesource.com',
    image_url = 'http://somesource.com/images/headline.jpg',
    summary = 'There is a new list of flying cars in Addis!',
    category = '59e1fb19032cc7284ab7c55a';

describe('article-data cont.js', () => {
    let body;
    let user, article, articleData, category;

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
                return request(app).post(articleUrl).send(data);
            })
            .then(res => {
                article = res.body;
                articleData = article.data;

                articleDataUrl = baseUrl + '/article-data';
                singleArticleDataUrl = articleDataUrl + '/' + articleData._id;
                followersUrl = singleArticleDataUrl + '/followers';
                followUrl = singleArticleDataUrl + '/follow';
                unfollowUrl = singleArticleDataUrl  + '/unfollow';
            });
    });

    describe('Fetching article-data test', () => {
        it('Should retrieve a list of article-data objects if an article is created', done => {
            request(app).get(articleDataUrl).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
                expect(body[0]).to.be.a('object');
                expect(body[0]).to.have.property('article').to.equal(article._id);
                done();
            });
        });

        it('Should retrieve a correct article-data object if an article is created', done => {
            request(app).get(singleArticleDataUrl).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('article').to.equal(article._id);
                expect(body).to.have.property('followers').to.be.a('array').to.be.empty;
                expect(body).to.have.property('comments').to.be.a('array').to.be.empty;
                expect(body).to.have.property('warnings').to.be.a('array').to.be.empty;
                expect(body).to.have.property('voters').to.be.a('array').to.be.empty;
                done();
            });
        });

        it('Should validate and fail to retrieve an article-data object that does not exist', done => {
            request(app).get(articleDataUrl + '/' + article._id).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').to.equal(true);
                expect(body).to.have.property('message').to.contain('not exist');
                expect(body).to.have.property('status').to.equal(404);
                done();
            });
        });
    });

    describe('Article followers test', () => {

        beforeEach(() => {
            return ArticleData.findOneAndUpdate({_id: articleData._id}, {followers: []}).exec();
        });

        afterEach(() => {
            return ArticleData.findOneAndUpdate({_id: articleData._id}, {followers: []}).exec();
        });

        it('Should retrieve an empty list of followers on a new article', done => {
            request(app).get(followersUrl).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.be.empty;
                done();
            });
        });

        describe('Article following test', () => {
            it('Should successfully add a follower to a new article', done => {
                request(app).post(followUrl).send({user}).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(201);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(false);
                    expect(body).to.have.property('message').contain('has been added as a follower');
                    expect(body).to.have.property('status').equal(201);

                    request(app).get(followersUrl).end((err, res) => {
                        body = res.body;

                        expect(res.status).to.equal(200);
                        expect(body).to.be.a('array');
                        expect(body).to.have.lengthOf(1);
                        expect(body[0]).to.be.a('object');
                        expect(body[0]).to.have.property('_id').equal(user._id);
                        done();
                    });
                });
            });

            it('Should fail to add a new follower if follower is already on the list', done => {
                request(app).post(followUrl).send({user}).end((err, res) => {
                    expect(res.status).to.equal(201);
                    request(app).post(followUrl).send({user}).end((err, res) => {
                        body = res.body;

                        expect(res.status).to.equal(400);
                        expect(body).to.be.a('object');
                        expect(body).to.have.property('error').to.equal(true);
                        expect(body).to.have.property('message').to.contain('is already following');
                        expect(body).to.have.property('status').to.equal(400);
                        done();
                    });
                });
            });

            it('Should fail to add a follower if user does not exist', done => {
                request(app).post(followUrl).send({user: article._id}).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contain('does not exist');
                    expect(body).to.have.property('status').equal(404);
                    done();
                });
            });
        });

        describe('Article unfollowing test', () => {
            it('Should successfully remove a follower from an article', done => {
                request(app).post(followUrl).send({user}).end((err, res) => {
                    expect(res.status).to.equal(201);
                    request(app).post(unfollowUrl).send({user}).end((err, res) => {
                        body = res.body;

                        expect(res.status).to.equal(200);
                        expect(body).to.be.a('object');
                        expect(body).to.have.property('error').equal(false);
                        expect(body).to.have.property('message').contain('has been removed as a follower');
                        expect(body).to.have.property('status').equal(200);

                        request(app).get(followersUrl).end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(200);
                            expect(body).to.be.a('array');
                            expect(body).to.be.empty;
                            done();
                        });
                    });
                });
            });

            it('Should fail to remove a follower if follower is not on the list', done => {
                request(app).post(followUrl).send({user}).end((err, res) => {
                    expect(res.status).to.equal(201);
                    request(app).post(unfollowUrl).send({user}).end((err, res) => {
                        expect(res.status).to.equal(200);
                        request(app).post(unfollowUrl).send({user}).end((err, res) => {
                            body = res.body;

                            expect(res.status).to.equal(400);
                            expect(body).to.be.a('object');
                            expect(body).to.have.property('error').equal(true);
                            expect(body).to.have.property('message').contain('is not following Article with');
                            expect(body).to.have.property('status').equal(400);
                            done();
                        });
                    });
                });
            });

            it('Should fail to remove a follower if user does not exist', done => {
                request(app).post(unfollowUrl).send({user: article._id}).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(404);
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message').contain('does not exist');
                    expect(body).to.have.property('status').equal(404);
                    done();
                });
            });
        });
    });
});