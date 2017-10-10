'use strict';

const router = require('express').Router();
const controller = require('../app/user/cont');

router.post('/signup', controller.signUp);

module.exports = router;