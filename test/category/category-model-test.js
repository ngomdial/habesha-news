'use strict';

const expect = require('chai').expect;

const data = require('../../config/data');

const Category = require('../../app/category/category-model');

describe('Category Model Test', () => {

    const {categoryName, categoryColor} = data.data;

    it('Should fail when name is missing', done => {
        const category = new Category();

        category.validate(err => {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('Should create a category with a default color', done => {
        const category = new Category();

        expect(category.color).to.equal('000000');
        done();
    });

    it('Should create a category with the given name and color', done => {
        const category = new Category({name: categoryName, color: categoryColor});

        expect(category.name).to.equal(categoryName);
        expect(category.color).to.equal(categoryColor);
        done();
    });
});