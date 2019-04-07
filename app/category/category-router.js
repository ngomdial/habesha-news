'use strict';

const router = require('express').Router();

const categoryController = require('./category-controller');

router.get('/', categoryController.findAll);
router.post('/', categoryController.create);

router.param('id', categoryController.validateOne);
router.get('/:id', categoryController.findOne);

module.exports = router;