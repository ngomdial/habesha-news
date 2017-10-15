'use strict';

const result = require('../../util/res');
const articleDataDal = require('./dal');

exports.findAll = (req, res) => {
    articleDataDal.findAll()
        .then(data => result.data(data, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, dataId) => {
    articleDataDal
        .findOne({_id: dataId})
        .then(data => {
            if (data) {
                req.articleData = data;
                next();
            } else {
                result.errorStatus(`ArticleData with _id ${dataId} does not exist`, 404, res);
            }
        });
};

exports.findOne = (req, res) => result.data(req.articleData, res);

