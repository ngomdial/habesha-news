'use strict';

const router = require('express').Router();

const controller = require('./comment-controller');

router.get('/', controller.findAll);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);

module.exports = router;