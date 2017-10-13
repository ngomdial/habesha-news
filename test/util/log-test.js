'use strict';

const sinon = require('sinon');
const log = require('../../util/log');
const Promise = require('bluebird');

describe('log.js', () => {
    const message = 'This is a log message';
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.spy(log, 'show');
    });

    it('Should call Log.e(error, message)', () => {
        log.e(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'error', message);
        });
    });

    it('Should call Log.w(warn, message)', () => {
        log.w(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'warn', message);
        });
    });

    it('Should call Log.i(warn, message)', () => {
        log.i(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'info', message);
        });
    });

    it('Should call Log.v(warn, message)', () => {
        log.v(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'verbose', message);
        });
    });

    it('Should call Log.d(warn, message)', () => {
        log.d(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'debug', message);
        });
    });

    it('Should call Log.s(warn, message)', () => {
        log.s(message);
        return Promise.resolve(() => {
            sinon.assert.calledWithExactly(log.show, 'silly', message);
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});

