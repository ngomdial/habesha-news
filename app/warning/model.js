'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warningSchema = new Schema({
        message:    {type: String, required: true},
        poster:     {type: Schema.Types.ObjectId, ref: 'User', required: true},
        article:    {type: Schema.Types.ObjectId, ref: 'Article', required: true},
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('Warning', warningSchema);