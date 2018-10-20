const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    permission: String,
    name: String,
    codeVideo: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('users', UserSchema);