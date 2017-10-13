'use strict';

const response = require('../../util/res');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Promise = require('bluebird');

describe('res.js', () => {
    const payload = {
        username: "saladthieves",
        password: "something_new",
        email: "salad@mail.com"
    };
    const res = {
        status: code => res,
        json: data => {}
    };

    let sandbox;

    describe('dataTests', () => {

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        it('Calls data(payload, res)', () => {
            sandbox.spy(response, 'data');
            sandbox.spy(res, 'status');
            sandbox.spy(res, 'json');

            response.data(payload, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.data, payload, res);
                sinon.assert.calledWith(res.status, 200);
                sinon.assert.calledWith(res.json, payload);
            });
        });

        it('Calls dataStatus(payload, status, res)', () => {
            const status = 201;

            sandbox.spy(response, 'dataStatus');
            sandbox.spy(res, 'status');
            sandbox.spy(res, 'json');

            response.dataStatus(payload, status, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.dataStatus, payload, status, res);
                sinon.assert.calledWith(res.status, status);
                sinon.assert.calledWith(res.json, payload);
            });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('messageTests', () => {
        const message = 'Invalid username or password';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        it('Calls message(message, res)', () => {
            sandbox.spy(response, 'message');

            response.message(message, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.message, message, res);
                sinon.assert.calledWithExactly(response.send, false, message, 200, res);
            });
        });

        it('Calls messageStatus(message, status, res)', () => {
            const status = 500;

            sandbox.spy(response, 'messageStatus');

            response.messageStatus(message, status, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.messageStatus, message, status, res);
                sinon.assert.calledWithExactly(response.send, false, message, status, res);
            });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('errorTests', () => {
        const message = 'This username is already taken';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        it('Calls error(message, res)', () => {
            sandbox.spy(response, 'error');

            response.error(message, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.error, message, res);
                sinon.assert.calledWithExactly(response.send, true, message, 400, res);
            });
        });

        it('Calls errorStatus(message, status, res)', () => {
            let status = 403;

            sandbox.spy(response, 'errorStatus');

            return Promise.resolve(() => {
                response.errorStatus(message, status, res);
                sinon.assert.calledWithExactly(response.errorStatus, message, status, res);
                sinon.assert.calledWithExactly(response.send, true, message, status, res);
            });
        });

        it('Calls errorReject(reject, res)', () => {
            let reject = response.reject(message);

            sandbox.spy(response, 'errorReject');

            response.errorReject(reject, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.errorReject, reject, res);
                sinon.assert.calledWithExactly(response.send, true, message, 400, res);
            });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('rejectTests', () => {
        const message = 'This email is already registered';

        beforeEach(() => {
            sandbox = sinon.createSandbox();
            sandbox.spy(response, 'send');
        });

        it('Calls reject(message)', () => {
            let reject = response.reject(message);

            return Promise.resolve(() => {
                sinon.assert.match(reject.message, message);
                sinon.assert.match(reject.status, 400);
                expect(reject).to.be.a('object');
            });
        });

        it('Calls rejectStatus(message, status)', () => {
            const status = 403;
            let reject = response.rejectStatus(message, status);

            return Promise.resolve(() => {
                sinon.assert.match(reject.status, 403);
                sinon.assert.match(reject.message, message);
                expect(reject).to.be.a('object');
            });
        });

        it('Calls send(error, message, status, res)', () => {
            let error = true,
                message = 'Something went wrong',
                status = 500;

            sandbox.spy(res, 'status');
            sandbox.spy(res, 'json');

            response.send(error, message, status, res);

            return Promise.resolve(() => {
                sinon.assert.calledWithExactly(response.send, error, message, status, res);
            });
        });

        it('finishes everything up', done => {
            sinon.assert.match(true, true);
            done();
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});