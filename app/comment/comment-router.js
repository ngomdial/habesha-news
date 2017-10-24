'use strict';

const router = require('express').Router();

const controller = require('./comment-controller');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);

module.exports = router;