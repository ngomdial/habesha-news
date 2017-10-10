'use strict';

const router = require('express').Router();
const controller = require('../app/profile/cont');

router.get('/', controller.findAll);

router.param('profile_id', controller.validateOne);
router.get('/:profile_id', controller.getOne);

module.exports = router;