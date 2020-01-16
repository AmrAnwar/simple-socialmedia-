const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [ true, 'can\'t be blank' ],
            match: [ /^[a-zA-Z0-9]+$/, 'username is invalid' ],
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [ true, 'can not be blank' ],
            match: [ /\S+@\S+\.\S+/, 'email is invalid' ],
            index: true
        },
        posts: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } ],
        hash: String
    },
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.ـid = obj._id.toString();
        delete obj.__v;
        delete obj.hash;
    }
});

module.exports = mongoose.model('User', userSchema);