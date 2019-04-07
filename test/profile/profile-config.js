'use strict';

const request = require('supertest');

const app = require('../../index');
const data = require('../../config/data');

const Profile = require('../../app/profile/profile-model');
const dal = require('../../app/profile/profile-dal');

const {profilesUrl} = data.data;

exports.deleteAll = () => Profile.remove({}).exec();

exports.findAll = () => request(app).get(profilesUrl);

exports.findOne = id => request(app).get(profilesUrl + '/' + id);