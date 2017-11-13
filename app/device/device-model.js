'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
        token:  {type: String, required: true, unique: true},
        user:   {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('Device', deviceSchema);
