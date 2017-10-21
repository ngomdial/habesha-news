'use strict';

const router = require('express').Router();

const controller = require('./user-controller');

router.get('/', controller.findAll);

router.post('/signup', controller.signUp);
router.post('/login', controller.login);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);

module.exports = router;