'use strict';

const router = require('express').Router();

const warningController = require('./warning-controller');

router.get('/', warningController.findAll);
router.post('/', warningController.create);

router.param(':id', warningController.validateOne);
router.get('/:id', warningController.findOne);

module.exports = router;