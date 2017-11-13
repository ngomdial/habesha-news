'use strict';

const router = require('express').Router();

const controller = require('./device-controller');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param(':id', controller.validateOne);
router.get('/:id', controller.findOne);
router.delete('/:id', controller.remove);

module.exports = router;