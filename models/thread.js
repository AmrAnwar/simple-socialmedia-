const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    body: String,
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


mongoose.model('Thread', ThreadSchema);