const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        username:   {type: String, required: true, unique: true},
        email:      {type: String, required: true, unique: true},
        password:   {type: String, required: true},
        profile:    {type: Schema.Types.ObjectId, ref: 'Profile'}
    },
    {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

module.exports = mongoose.model('User', userSchema);