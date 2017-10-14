'use strict';

const Promise = require('bluebird');
const helper = require('../../util/helper');

exports.hasRequiredFields = req => {
    return new Promise((resolve, reject) => {
        helper.validateEmpty('headline', 'No headline provided', reject, req);
        helper.validateEmpty('source_url', 'No source_url provided', reject, req);
        helper.validateEmpty('image_url', 'No image_url provided', reject, req);
        helper.validateEmpty('summary', 'No summary provided', reject, req);
        helper.validateEmpty('category', 'No category provided', reject, req);
        helper.validateEmpty('user', 'No user provided', reject, req);

        helper.sanitizeTrim(req, ['headline', 'source_url', 'image_url', 'summary', 'category', 'user']);

        let {headline, source_url, image_url, summary, category, user} = req.body;

        resolve({headline, source_url, image_url, summary, category, user});
    });
};