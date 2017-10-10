'use strict';

const router = require('express').Router();
const controller = require('../app/user/cont');

router.post('/signup', controller.signUp);
router.get('/', controller.findAll);

router.param('user_id', controller.validateOne);
router.get('/:user_id', controller.getOne);

module.exports = router;