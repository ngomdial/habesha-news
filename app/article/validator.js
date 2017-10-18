'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('headline', 'No headline provided', reject, req);
        helper.validateEmpty('source_url', 'No source_url provided', reject, req);
        helper.validateEmpty('image_url', 'No image_url provided', reject, req);
        helper.validateEmpty('summary', 'No summary provided', reject, req);
        helper.validateEmptyOnly('category', 'No category provided', reject, req);
        helper.validateEmptyOnly('poster', 'No poster provided', reject, req);

        helper.sanitizeTrim(req, ['headline', 'source_url', 'image_url', 'summary']);

        let {headline, source_url, image_url, summary, category, poster} = req.body;

        resolve({headline, source_url, image_url, summary, category, poster});
    });
};

exports.hasFollowFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('user', 'No user provided', reject, req);
        resolve(req.body.user);
    });
};

exports.hasVoteFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmptyOnly('user', 'No user provided', reject, req);

        resolve(req.body);
    });
};