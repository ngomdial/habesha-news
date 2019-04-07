'use strict';

const expect = require('chai').expect;

const Profile = require('../../app/profile/profile-model');

describe('Profile Model Test', () => {
    it('Should fail to create a profile if User is missing', done => {
        const profile = new Profile();

        profile.validate(err => {
            expect(err.errors.user).to.exist;
            done();
        });
    });

    it('Should create a profile with default values', done => {
        const profile = new Profile();

        expect(profile).to.be.a('object');
        expect(profile).to.have.property('picture_url').equal('-');
        expect(profile).to.have.property('allow_notifications').to.equal(true);
        done();
    });

    it('Should create a profile with given values', done => {
        const profile = new Profile({
            allow_notifications: false,
            picture_url: 'http://www.image.com'
        });

        expect(profile).to.be.a('object');
        expect(profile).to.have.property('picture_url').equal('http://www.image.com');
        expect(profile).to.have.property('allow_notifications').to.equal(false);
        done();
    });
});