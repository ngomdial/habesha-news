'use strict';

const router = require('express').Router();
const controller = require('../app/comment/cont');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param('comment_id', controller.validateOne);
router.get('/:comment_id', controller.findOne);

router.post('/:comment_id/like', controller.likeComment);
router.post('/:comment_id/dislike', controller.dislikeComment);

module.exports = router;