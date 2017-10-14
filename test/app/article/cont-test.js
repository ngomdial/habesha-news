'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../../index');

const Article = require('../../../app/article/model');
const ArticleData = require('../../../app/article-data/model');
const Category = require('../../../app/category/model');
const User = require('../../../app/user/model');

describe('article cont.js', () => {
    const base_url = process.env.BASE_URL + '/' + process.env.VERSION;

    let body;

    before(() => {
        return Article.remove({}).exec()
            .then(() => ArticleData.remove({}).exec())
            .then(() => Category.remove({}).exec())
            .then(() => User.remove({}).exec());
    });

    describe('Post article test', () => {
        let post_article_url = base_url + '/articles';

        let postArticle = data => request(app).post(post_article_url).send(data);

        const headline = 'New flying cars',
            source_url = 'http://somesource.com',
            image_url = 'http://somesource.com/images/headline.jpg',
            summary = 'There is a new list of flying cars in Addis!',
            category = '59e1fb19032cc7284ab7c55a',
            poster = '59e1fb19032cc7284ab7c55c';

        describe('Validate input test', () => {

            it('Should fail validation if req.body is empty', done => {
                let data = {};
                postArticle(data).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(400);
                    expect(body).to.be.a('object');
                    expect(body).to.have.property('error').equal(true);
                    expect(body).to.have.property('message');
                    expect(body).to.have.property('status').equal(400);
                    done();
                });
            });

            it('Should fail validation if headline is missing', done => {
                let data = {source_url, image_url, summary, category, poster};
                postArticle(data).end((err, res) => {
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
                let data = {headline, image_url, summary, category, poster};
                postArticle(data).end((err, res) => {
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
                let data = {headline, source_url, summary, category, poster};
                postArticle(data).end((err, res) => {
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
                let data = {headline, source_url, image_url, category, poster};
                postArticle(data).end((err, res) => {
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
                let data = {headline, source_url, image_url, summary, poster};
                postArticle(data).end((err, res) => {
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
                let data = {headline, source_url, image_url, summary, category};
                postArticle(data).end((err, res) => {
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

        describe('Article data saving test', () => {
            const create_category_url = base_url + '/categories';

            beforeEach(() => {
                return Article.remove({}).exec()
                    .then(() => ArticleData.remove({}).exec())
                    .then(() => Category.remove({}).exec())
                    .then(() => User.remove({}).exec());
            });

            it('Should fail posting if category does not exist', done => {
                let data = {headline, source_url, image_url, summary, category, poster};
                postArticle(data).end((err, res) => {
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

            it('Should create an article if all data is present', done => {
                // create category first
                request(app).post(create_category_url).send({name: 'politics'}).end((err, res) => {
                    let category = res.body._id;
                    const signup_url = base_url + '/users/signup';
                    const username = 'saladthieves',
                        email = 'salad@mail.com',
                        password = 'something_else';

                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('name').equal('politics');

                    // then create user
                    request(app).post(signup_url).send({username, email, password}).end((err, res) => {
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
    });

    after(() => {
        return Article.remove({}).exec()
            .then(() => ArticleData.remove({}).exec())
            .then(() => Category.remove({}).exec())
            .then(() => User.remove({}).exec());
    });
});