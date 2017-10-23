'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const data = require('../../config/data');

const Comment = require('../../app/comment/comment-model');

describe('Comment Model Test', () => {
    const {commentMessage} = data.data;

    it('Should fail when all inputs are missing', done => {
        const comment = new Comment();

        comment.validate(err => {
            expect(err.errors.message).to.exist;
            expect(err.errors.poster).to.exist;
            done();
        });
    });

    it('Should fail when message is missing', done => {
        const comment = new Comment({poster: new mongoose.mongo.ObjectId()});

        comment.validate(err => {
            expect(err.errors.message).to.exist;
            done();
        });
    });

    it('Should fail when poster is missing', done => {
        const comment = new Comment({message: commentMessage});

        comment.validate(err => {
            expect(err.errors.poster).to.exist;
            done();
        });
    });
});