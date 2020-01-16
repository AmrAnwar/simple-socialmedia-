const mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    body: String,
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });


mongoose.model('Post', PostSchema);