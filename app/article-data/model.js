'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleDataSchema = new Schema({
        article:    {type: Schema.Types.ObjectId, ref: 'Article', required: true},
        comments:   [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        followers:  [{type: Schema.Types.ObjectId, ref: 'User'}],
        warnings:   [{type: Schema.Types.ObjectId, ref: 'Warning'}],
        voters:     [{type: Schema.Types.ObjectId, ref: 'User'}]
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('ArticleData', articleDataSchema);