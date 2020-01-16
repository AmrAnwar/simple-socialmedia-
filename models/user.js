const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    username: { type: String, lowercase: true, unique: true,
        required: [true, 'can\'t be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'username is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true,
        required: [true, 'can not be blank'],
        match: [/\S+@\S+\.\S+/, 'email is invalid'], index: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    hash: String, }, { timestamps: true });

mongoose.model('User', UserSchema);