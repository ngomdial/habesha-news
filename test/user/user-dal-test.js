'use strict';

const expect = require('chai').expect;

const dal = require('../../app/user/user-dal');

const userConfig = require('./user-config');
const data = require('../../config/data');

describe('User DAL Operations Test', () => {

    const {username, email} = data.data;

    beforeEach(() => {
        return userConfig.deleteAll();
    });

    it('Should retrieve an empty list of users', () => {
        return userConfig.findAll().then(users => {
            expect(users).to.be.a('array');
            expect(users).to.have.lengthOf(0);
        });
    });

    describe('Retrieving Saved Users Test', () => {
        beforeEach(() => {
            return userConfig.deleteAll()
                .then(() => userConfig.signUp());
        });

        it('Should retrieve a list of saved users', () => {
            return userConfig.findAll().then(users => {
                expect(users).to.be.a('array');
                expect(users).to.have.lengthOf(1);
                expect(users[0]).to.have.property('username').equal(username);
                expect(users[0]).to.have.property('email').equal(email);
            });
        });

        it('Should retrieve a single saved user', () => {
            return userConfig.findOne({username}).then(user => {
                expect(user).to.be.a('object');
                expect(user).to.have.property('username').equal(username);
                expect(user).to.have.property('email').equal(email);
            });
        });

        it('Should fail to retrieve an invalid user', () => {
            return userConfig.findOne({username: 'some_weird_name'}).then(user => {
                expect(user).to.be.a('null');
            });
        });
    });

    afterEach(() => {
        return userConfig.deleteAll();
    });
});