'use strict';

const result = require('../../util/res');
const articleDal = require('./dal');

exports.create = (req, res) => {

};

exports.findAll = (req, res) => {
    articleDal.findAll()
        .then(data => result.data(data, res))
        .catch(reject => result.errorReject(reject, res));
};

exports.validateOne = (req, res, next, dataId) => {
    articleDal
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

