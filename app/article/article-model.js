'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
        headline:   {type: String, required: true},
        source_url: {type: String, required: true},
        image_url:  {type: String, required: true},
        summary:    {type: String, required: true},
        status:     {type: String, default: 'pending'},
        poster:     {type: Schema.Types.ObjectId, ref: 'User', required: true},
        category:   {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        comments:   [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        followers:  [{type: Schema.Types.ObjectId, ref: 'User'}],
        warnings:   [{type: Schema.Types.ObjectId, ref: 'Warning'}],
        voters:     [{type: Schema.Types.ObjectId, ref: 'Voters'}]
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('Article', articleSchema);