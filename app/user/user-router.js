'use strict';

const router = require('express').Router();

const controller = require('./user-controller');

router.post('/signup', controller.signUp);

module.exports = router;