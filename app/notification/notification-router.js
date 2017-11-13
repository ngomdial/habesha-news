'use strict';

const router = require('express').Router();

const controller = require('./notification-controller');

router.post('/create', controller.create);

module.exports = router;