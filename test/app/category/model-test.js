'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');
const sandbox = sinon.createSandbox();

const Category = require('../../../app/category/model');

describe('category model.js', () => {

    afterEach(() => {
        sandbox.restore();
    });

    it('Should fail upon saving, if name is missing', () => {
        let category = new Category();

        return Promise.resolve(() => {
            category.validate(err => {
                expect(err.errors.name).to.exist;
            });
        });
    });
});