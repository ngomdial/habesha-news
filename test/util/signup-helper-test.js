'use strict';

const Promise = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const expect = chai.expect;

chai.use(chaiHttp);

const helper = require('../../util/signup-helper');

describe('signup-helper.js', () => {
    let sandbox;

    let body;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    describe('login test', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        it('Should fail if body is empty', () => {
            body = {};

            return helper.hasLoginCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if body is empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('provided');
                });
        });

        it('Should fail if body has empty username', () => {
            body = {username: ' ', password: 'my_cool_password'};

            return helper.hasLoginCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if username is empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('username provided');
                });
        });

        it('Should fail if body has empty password', () => {
            body = {username: 'my_cool_username', password: '  '};

            return helper.hasLoginCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if password is empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('password provided');
                });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('signup test', () => {
        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        it('Should fail if body is empty', () => {
            body = {};

            return helper.hasSignUpCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if body is empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('provided');
                });
        });

        it('Should fail if body has empty email', () => {
            body = {email: '  ', username: 'some_username', password: 'my_cool_password'};

            return helper.hasSignUpCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if email is empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('email provided');
                });
        });

        it('Should fail if body has empty username', () => {
            body = {email: 'some@email.add', username: '  ', password: 'my_cool_password'};

            return helper.hasSignUpCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if username empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('username provided');
                });
        });

        it('Should fail if body has empty password', () => {
            body = {email: 'some@email.add', username: 'some_username', password: '  '};

            return helper.hasSignUpCredentials(body)
                .then(() => {
                    expect.fail('This test should NOT pass if password empty!');
                })
                .catch(reject => {
                    expect(reject).to.be.a('object');
                    expect(reject).to.have.property('message').to.contains('password provided');
                });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    after(() => {
        sandbox.restore();
    });
});