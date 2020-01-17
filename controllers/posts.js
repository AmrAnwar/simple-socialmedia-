const router = require('express').Router();
// const mongoose = require('mongoose');
const Post = require('../models/post');

router.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        res.json(posts);
    });
});

module.exports = router;
