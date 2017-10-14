'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

const Category = require('../../../app/category/model');

describe('category model.js', () => {       // TODO: Test for uniqueness of name
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    it('Should fail upon saving, if name is missing', () => {
        let category = new Category();

        return Promise.resolve(() => {
            category.validate(err => {
                expect(err.errors.name).to.exist;
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});