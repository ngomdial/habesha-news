'use strict';

const sinon = require('sinon');

const log = require('../../util/log');

describe('log.test', () => {

    let sandbox;
    const message = 'This is a test message';

    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.spy(log, 'show');
    });

    it('Should call log.e with the provided arguments', () => {
        log.e(message);
        return sinon.assert.calledWithExactly(log.show, 'error', message);
    });

    it('Should call log.w with the provided arguments', () => {
        log.w(message);
        return sinon.assert.calledWithExactly(log.show, 'warn', message);
    });

    it('Should call log.i with the provided arguments', () => {
        log.i(message);
        return sinon.assert.calledWithExactly(log.show, 'info', message);
    });

    it('Should call log.v with the provided arguments', () => {
        log.v(message);
        return sinon.assert.calledWithExactly(log.show, 'verbose', message);
    });

    it('Should call log.d with the provided arguments', () => {
        log.d(message);
        return sinon.assert.calledWithExactly(log.show, 'debug', message);
    });

    it('Should call log.s with the provided arguments', () => {
        log.s(message);
        return sinon.assert.calledWithExactly(log.show, 'silly', message);
    });

    after(() => {
        sandbox.restore();
    });
});