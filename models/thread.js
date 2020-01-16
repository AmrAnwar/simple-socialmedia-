const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
    {
        body: String,
        threads: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' } ],
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

threadSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.ـid = obj._id.toString();
        delete obj.__v;
    }
});

module.exports = mongoose.model('Thread', threadSchema);