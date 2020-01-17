const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        body: String,
        threads: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' } ],
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

postSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.ـid = obj._id.toString();
        delete obj._id;
        delete obj.__v;
    }
});

module.exports = mongoose.model('Post', postSchema);