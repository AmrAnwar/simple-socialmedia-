const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
    {
        body: { type: String,
            required: true },
        threads: [ { type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread' } ],
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

module.exports = mongoose.model('Thread', threadSchema);