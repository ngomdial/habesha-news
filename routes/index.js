'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        author:     process.env.AUTHOR,
        version:    process.env.VERSION,
        port:       process.env.PORT,
        env:       process.env.NODE_ENV,
        base_url:   process.env.BASE_URL + '/' + process.env.VERSION
    });
});

router.use('/users', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/articles', require('./articles'));
router.use('/categories', require('./categories'));
router.use('/article-data', require('./article-data'));
router.use('/comments', require('./comments'));

module.exports = router;