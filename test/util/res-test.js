'use strict';

const response = require('../../util/res');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

describe('res.js', () => {
    let payload = {
        username: "saladthieves",
        password: "something_new",
        email: "salad@mail.com"
    };
    let res = {
        status: code => res,
        json: data => {}
    };
    let sandbox;

    describe('dataTests', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Calls data(payload, res)', done => {
            sandbox.spy(response, 'data');
            sandbox.spy(res, 'status');
            sandbox.spy(res, 'json');

            response.data(payload, res);

            sinon.assert.calledWithExactly(response.data, payload, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, payload);
            done();
        });

        it('Calls dataStatus(payload, status, res)', done => {
            const status = 201;

            sandbox.spy(response, 'dataStatus');
            sandbox.spy(res, 'status');
            sandbox.spy(res, 'json');

            response.dataStatus(payload, status, res);

            sinon.assert.calledWithExactly(response.dataStatus, payload, status, res);
            sinon.assert.calledWith(res.status, status);
            sinon.assert.calledWith(res.json, payload);
            done();
        });
    });

    describe('messageTests', () => {
        const message = 'Invalid username or password';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Calls message(message, res)', done => {
            sandbox.spy(response, 'message');

            response.message(message, res);

            sinon.assert.calledWithExactly(response.message, message, res);
            sinon.assert.calledWithExactly(response.send, false, message, 200, res);
            done();
        });

        it('Calls messageStatus(message, status, res)', done => {
            const status = 500;

            sandbox.spy(response, 'messageStatus');

            response.messageStatus(message, status, res);

            sinon.assert.calledWithExactly(response.messageStatus, message, status, res);
            sinon.assert.calledWithExactly(response.send, false, message, status, res);
            done();
        });
    });

    describe('errorTests', () => {
        const message = 'This username is already taken';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Calls error(message, res)', done => {
            sandbox.spy(response, 'error');

            response.error(message, res);

            sinon.assert.calledWithExactly(response.error, message, res);
            sinon.assert.calledWithExactly(response.send, true, message, 400, res);
            done();
        });

        it('Calls errorStatus(message, status, res)', done => {
            let status = 403;

            sandbox.spy(response, 'errorStatus');

            response.errorStatus(message, status, res);
            sinon.assert.calledWithExactly(response.errorStatus, message, status, res);
            sinon.assert.calledWithExactly(response.send, true, message, status, res);
            done();
        });

        it('Calls errorReject(reject, res)', done => {
            let reject = response.reject(message);

            sandbox.spy(response, 'errorReject');

            response.errorReject(reject, res);

            sinon.assert.calledWithExactly(response.errorReject, reject, res);
            sinon.assert.calledWithExactly(response.send, true, message, 400, res);
            done();
        });
    });

    describe('rejectTests', () => {
        const message = 'This email is already registered';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('Calls reject(message)', done => {
            let reject = response.reject(message);

            sinon.assert.match(reject.message, message);
            sinon.assert.match(reject.status, 400);
            expect(reject).to.be.a('object');
            done();
        });

        it('Calls rejectStatus(message, status)', done => {
            const status = 403;
            let reject = response.rejectStatus(message, status);

            sinon.assert.match(reject.status, 403);
            sinon.assert.match(reject.message, message);
            expect(reject).to.be.a('object');
            done();
        })
    });

    it('Calls send(error, message, status, res)', done => {
        sandbox = sinon.createSandbox();

        sandbox.spy(response, 'send');
        sandbox.spy(res, 'status');
        sandbox.spy(res, 'json');

        let error = true,
            message = 'Something went wrong',
            status = 500;

        response.send(error, message, status, res);

        sinon.assert.calledWithExactly(response.send, error, message, status, res);

        sandbox.restore();
        done();
    });
});