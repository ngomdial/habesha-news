'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../index');
const data = require('../../config/data');

describe('Routes Index/Root Test', () => {
    let {author, version, baseUrl} = data.data;
    it('Should return metadata about the API', () => {
        return request(app).get(baseUrl).then(res => {
            let body = res.body;

            expect(res.status).to.equal(200);
            expect(body).to.be.a('object');
            expect(body).to.have.property('author').equal(author);
            expect(body).to.have.property('version').equal(version);
        });
    });
});