'use strict';

const router = require('express').Router();

const controller = require('./comment-controller');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);

router.get('/:id/likes', controller.findLikes);
router.post('/:id/likes', controller.like);

router.get('/:id/dislikes', controller.findDislikes);
router.post('/:id/dislikes', controller.dislike);

module.exports = router;