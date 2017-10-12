'use strict';

require('../../config/index');

const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const User = require('../../../app/user/model');
const dal = require('../../../app/user/dal');

describe('user dal.js', () => {
    let username = "saladthieves",
        email = "salad@mail.com",
        password = "something_else";

    beforeEach(() => {
        User.remove({}).exec();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Calls create(username, email, password)', () => {

        // sandbox.spy(dal, 'create');

        return dal
            .create(username, email, password)
            .then(user => {
                // sinon.assert.calledWithExactly(dal.create, username, email, password);
                expect(user).to.be.a('object');
                expect(user.username).to.equal(username);
                expect(user.email).to.equal(email);
                expect(user.password).to.equal(password);
            });
    });

    it('Calls update(user)', () => {

        let profile = '59de58e5812e5b38933994b8';
        let time;

        return dal
            .create(username, email, password)
            .then(user => {
                time = user.updated_at;
                user.profile = profile;
                return dal.update(user);
            })
            .then(updated => {
                expect(updated.profile.toString()).to.equal(profile);
                expect(updated.updated_at).not.to.equal(time);
            });
    });

    it('Calls findOne(query)', () => {
        let user;

        return dal
            .create(username, email, password)
            .then(created => {
                user = created;
                return dal.findOne({_id: user._id});
            })
            .then(found => {
                expect(found).to.be.a('object');
                expect(found._id.toString()).to.equal(user.id.toString());
                expect(found.username).to.equal(username);
                expect(found.email).to.equal(email);
                expect(found.password).to.equal(password);
            });
    });

    it('Calls findAll()', () => {
        return dal
            .findAll()
            .then(users => {
                expect(users).to.be.a('array');
                expect(users).to.be.empty;
            });
    });

    it('Calls findAll() with data already saved', () => {
        return dal
            .create(username, email, password)
            .then(() => {
                return dal.create('salad', 'thieves@mail.com', 'password');
            })
            .then(() => {
                return dal.findAll();
            })
            .then(users => {
                expect(users).to.be.a('array');
                expect(users).to.have.lengthOf(2);
            });
    });
});