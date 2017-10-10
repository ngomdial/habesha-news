'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        author:     process.env.AUTHOR,
        version:    process.env.VERSION,
        port:       process.env.PORT,
        base_url:   process.env.BASE_URL + '/' + process.env.VERSION
    });
});

module.exports = router;