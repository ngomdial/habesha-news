'use strict';

const router = require('express').Router();
const controller = require('../app/article/cont');

router.get('/', controller.findAll);

router.param('article_id', controller.validateOne);
router.get('/:article_id', controller.findOne);

module.exports = router;