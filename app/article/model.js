'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
        headline:   {type: String, required: true},
        source_url: {type: String, required: true},
        image_url:  {type: String, required: true},
        summary:    {type: String, required: true},
        status:     {type: String, default: 'pending'},     // TODO: Come up with a specific list of article statuses
        category:   {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        poster:     {type: Schema.Types.ObjectId, ref: 'User', required: true},
        data:       {type: Schema.Types.ObjectId, ref: 'ArticleData', required: true}
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);