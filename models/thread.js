const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
    {
        parentPost: { type: mongoose.Schema.Types.ObjectId , ref: 'Post', required: true },
        parentThread: { type: mongoose.Schema.Types.ObjectId , ref: 'Thread' },
        body: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId,
            ref: 'User' }
    },
    { timestamps: true }
);

threadSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
    }
});

/* TODO custom validation for parentPost or Thread */

module.exports = mongoose.model('Thread', threadSchema);