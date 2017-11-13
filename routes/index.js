'use strict';

const router = require('express').Router();
const result = require('../util/res');

router.get('/', (req, res) => {
    const data = {
        author:     process.env.AUTHOR,
        version:    process.env.VERSION,
        port:       process.env.PORT,
        env:        process.env.NODE_ENV,
        base_url:   process.env.BASE_URL + '/' + process.env.VERSION,
        status:     'running'
    };
    result.data(data, res);
});

router.use('/users', require('../app/user/user-router'));
router.use('/profiles', require('../app/profile/profile-router'));
router.use('/categories', require('../app/category/category-router'));
router.use('/comments', require('../app/comment/comment-router'));
router.use('/articles', require('../app/article/article-router'));
router.use('/warnings', require('../app/warning/warning-router'));
router.use('/devices', require('../app/device/device-router'));

module.exports = router;