'use strict';

const router = require('express').Router();
const controller = require('../app/article-data/cont');

router.get('/', controller.findAll);

router.param('data_id', controller.validateOne);
router.get('/:data_id', controller.findOne);
router.get('/:data_id/followers', controller.findFollowers);
router.post('/:data_id/follow', controller.follow);
router.post('/:data_id/unfollow', controller.unfollow);

router.get('/:data_id/votes', controller.getVotes);
router.post('/:data_id/votes', controller.addVote);
// TODO: Add vote endpoint

module.exports = router;