'use strict';

const sinon = require('sinon');
const log = require('../../util/log');

describe('log.js', () => {
    let sandbox;
    const message = 'This is a log message';

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.spy(log, 'show');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should call Log.e(error, message)', done => {
        log.e(message);
        sinon.assert.calledWithExactly(log.show, 'error', message);
        done();
    });

    it('Should call Log.w(warn, message)', done => {
        log.w(message);
        sinon.assert.calledWithExactly(log.show, 'warn', message);
        done();
    });

    it('Should call Log.i(warn, message)', done => {
        log.i(message);
        sinon.assert.calledWithExactly(log.show, 'info', message);
        done();
    });

    it('Should call Log.v(warn, message)', done => {
        log.v(message);
        sinon.assert.calledWithExactly(log.show, 'verbose', message);
        done();
    });

    it('Should call Log.d(warn, message)', done => {
        log.d(message);
        sinon.assert.calledWithExactly(log.show, 'debug', message);
        done();
    });

    it('Should call Log.s(warn, message)', done => {
        log.s(message);
        sinon.assert.calledWithExactly(log.show, 'silly', message);
        done();
    });
});

