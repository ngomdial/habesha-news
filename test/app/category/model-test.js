'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Category = require('../../../app/category/model');

describe('category model.js', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if name is missing', done => {
        let category = new Category();

        category.validate(err => {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});