'use strict';

const router = require('express').Router();
const controller = require('../app/user/cont');

router.post('/signup', controller.signUp);
router.get('/', controller.findAll);

module.exports = router;