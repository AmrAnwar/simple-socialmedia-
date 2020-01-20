const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            minglength: 3,
            required: [ true, 'can\'t be blank' ],
            match: [ /^\w[_a-zA-Z0-9]*$/, 'invalid username' ],
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [ true, 'can not be blank' ],
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