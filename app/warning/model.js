'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const warningSchema = new Schema({
        data:       {type: Schema.Types.ObjectId, ref:'ArticleData', required: true},
        message:    {type: String, required: true},
        poster:     {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('Warning', warningSchema);