'use strict';

const router = require('express').Router();

const controller = require('./article-controller');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);
router.post('/:id/follow', controller.follow);
router.post('/:id/unfollow', controller.unFollow);

module.exports = router;