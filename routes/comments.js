'use strict';

const router = require('express').Router();
const controller = require('../app/comment/cont');

router.get('/', controller.findAll);

router.param('comment_id', controller.validateOne);
router.get('/:comment_id', controller.findOne);

module.exports = router;