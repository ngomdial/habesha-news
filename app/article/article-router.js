'use strict';

const router = require('express').Router();

const controller = require('./article-controller');

router.get('/', controller.findAll);
router.post('/', controller.create);

router.param('id', controller.validateOne);
router.get('/:id', controller.findOne);

router.get('/:id/followers', controller.findFollowers);
router.post('/:id/followers', controller.follow);
router.delete('/:id/followers', controller.unFollow);

router.get('/:id/voters', controller.findVoters);
router.post('/:id/voters', controller.vote);
router.delete('/:id/voters', controller.unVote);

module.exports = router;