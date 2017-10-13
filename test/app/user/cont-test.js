'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../../../index');

describe('user cont.js', () => {
    it('Should fail signup with email missing', done => {
        chai.request(app)
            .get('/habesha-news-api/v1-0/')
            .end((err, res) => {
                expect(res).to.be.a('object');
                done();
            });
    });
});