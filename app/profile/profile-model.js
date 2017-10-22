'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
        picture_url:            {type: String, default: '-'},
        allow_notifications:    {type: Boolean, default: true},
        user:                   {type: Schema.Types.ObjectId, ref: 'User', required: true},
        categories:             [{type: Schema.Types.ObjectId, ref: 'Category'}]
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('Profile', profileSchema);