'use strict';

const router = require('express').Router();
const controller = require('../app/article-data/cont');

router.get('/', controller.findAll);

router.param('data_id', controller.validateOne);
router.get('/:data_id', controller.findOne);

module.exports = router;