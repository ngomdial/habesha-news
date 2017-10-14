'use strict';

const router = require('express').Router();
const controller = require('../app/warning/cont');

router.get('/', controller.findAll);

router.param('warning_id', controller.validateOne);
router.get('/:warning_id', controller.findOne);

module.exports = router;