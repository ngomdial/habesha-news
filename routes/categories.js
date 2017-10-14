'use strict';

const router = require('express').Router();
const controller = require('../app/category/cont');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param('category_id', controller.validateOne);
router.get('/:category_id', controller.findOne);

module.exports = router;