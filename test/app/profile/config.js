'use strict';

const Profile = require('../../../app/profile/model');

exports.deleteAll = () => Profile.remove({}).exec();