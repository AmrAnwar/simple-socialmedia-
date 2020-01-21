const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            minlength: [3, 'username must be at least three characters long'],
            required: [ true, 'missing username' ],
            match: [ /^[_a-zA-Z]\w*$/, 'invalid username' ],
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [ true, 'missing email' ],
            match: [ /\S+@\S+\.\S+/, 'invalid email' ],
            index: true
        },
        posts: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } ],
        hash: String
    },
    { timestamps: true }
);

userSchema.plugin(validator);

userSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
        delete obj.hash;
    }
});

module.exports = mongoose.model('User', userSchema);