'use strict';

const router = require('express').Router();
const controller = require('../app/article/cont');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param('article_id', controller.validateOne);
router.get('/:article_id', controller.findOne);
router.get('/:article_id/comments', controller.getComments);
router.post('/:article_id/comments', controller.postComment);

module.exports = router;