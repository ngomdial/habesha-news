'use strict';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const expect = chai.expect;

const app = require('../../../index');
const Category = require('../../../app/category/model');
const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;

describe('category cont.js', () => {

    const createCategoryUrl = baseUrl + '/categories';
    let body;

    beforeEach(() => {
        return Category.remove({}).exec();
    });

    let createCategory = data => request(app).post(createCategoryUrl).send(data);

    it('Should fail if name is missing', done => {
        createCategory({}).end((err, res) => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contain('No name provided');
            expect(body).to.have.property('status').equal(400);
            done();
        });
    });

    it('Should fail if category name already exists', done => {
        createCategory({name: 'Politics'}).end((err, res) => {
            expect(res.status).to.equal(201);
            createCategory({name: '   pOLiTICs   '}).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(400);
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contain('already exists');
                expect(body).to.have.property('status').equal(400);
                done();
            });
        });
    });

    it('Should save category, with a default color', done => {
        createCategory({name: 'Politics'}).end((err, res) => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('name').equal('politics');
            expect(body).to.have.property('color').equal('#000000');
            done();
        });
    });

    it('Should save category, with a given color', done => {
        createCategory({name: 'Politics', color: '#00AAFF'}).end((err, res) => {
            body = res.body;

            expect(res.status).to.equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('name').equal('politics');
            expect(body).to.have.property('color').equal('#00AAFF');
            done();
        });
    });

    it('Should retrieve all saved categories', done => {
        createCategory({name: 'politics', color: '#00AAFF'}).end((err, res) => {
            expect(res.status).to.equal(201);
            createCategory({name: 'sports'}).end((err, res) => {
                expect(res.status).to.equal(201);
                request(app).get(createCategoryUrl).end((err, res) => {
                    body = res.body;

                    expect(res.status).to.equal(200);
                    expect(body).to.be.a('array');
                    expect(body).to.have.lengthOf(2);
                    done();
                });
            });
        });
    });

    it('Should validate a single saved category', done => {
        createCategory({name: 'politics', color: '#00AAFF'}).end((err, res) => {
            expect(res.status).to.equal(201);
            request(app).get(createCategoryUrl + '/58e28da07266494fa855141f').end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(404);
                done();
            });
        });
    });

    it('Should retrieve a single saved category', done => {
        createCategory({name: 'politics', color: '#00AAFF'}).end((err, res) => {
            expect(res.status).to.equal(201);
            request(app).get(createCategoryUrl + '/' + res.body._id).end((err, res) => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('name').equal('politics');
                expect(body).to.have.property('color').equal('#00AAFF');
                done();
            });
        });
    });

    afterEach(() => {
        return Category.remove({}).exec();
    });
});