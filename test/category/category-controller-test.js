'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const categoryConfig = require('./category-config');

const data = require('../../config/data');

describe('Category Controller Test', () => {

    let body;

    const {categoryName, categoryColor} = data.data;

    beforeEach(() => categoryConfig.deleteAll());

    it('Should fail to create a category if name is missing', () => {
        return categoryConfig.create().then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('provided');
            expect(body).to.have.property('message').contains('name');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should create a category if name is provided', () => {
        return categoryConfig.create({name: categoryName}).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('name').equal(categoryName);
            expect(body).to.have.property('color').equal('000000');
        });
    });

    it('Should create a category if name and color are provided', () => {
        return categoryConfig.create({name: categoryName, color: categoryColor}).then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('name').equal(categoryName);
            expect(body).to.have.property('color').equal(categoryColor);
        });
    });

    it('Should fail to create a category if it already exists', () => {
        return categoryConfig.create({name: categoryName, color: categoryColor}).then(() =>
            categoryConfig.create({name: categoryName, color: categoryColor})).then(res => {
            body = res.body;

            expect(res.status).to.equal(400);
            expect(body).to.have.property('error').equal(true);
            expect(body).to.have.property('message').contains('already exists');
            expect(body).to.have.property('status').equal(400);
        });
    });

    it('Should retrieve an empty list of categories', () => {
        return categoryConfig.findAll().then(res => {
            body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('array');
            expect(body).to.have.lengthOf(0);
        });
    });

    describe('Category Retrieval Test', () => {
        let category;

        beforeEach(() => categoryConfig.deleteAll()
            .then(() => categoryConfig.create({name: categoryName}))
            .then(res => {
                category = res.body;
            }));

        it('Should retrieve a non empty list of categories', () => {
            return categoryConfig.findAll().then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('array');
                expect(body).to.have.lengthOf(1);
            });
        });

        it('Should retrieve a single saved category', () => {
            return categoryConfig.findOne(category._id).then(res => {
                body = res.body;

                expect(res.status).to.equal(200);
                expect(body).to.be.a('object');
                expect(body).to.have.property('name').equal(categoryName);
            })
        });

        it('Should fail to retrieve a category that does not exist', () => {
            return categoryConfig.findOne(new mongoose.mongo.ObjectId()).then(res => {
                body = res.body;

                expect(res.status).to.equal(404);
                expect(body).to.be.a('object');
                expect(body).to.have.property('error').equal(true);
                expect(body).to.have.property('message').contains('does not exist');
                expect(body).to.have.property('status').equal(404);
            })
        });

        afterEach(() => categoryConfig.deleteAll());
    });

    afterEach(() => categoryConfig.deleteAll());
});