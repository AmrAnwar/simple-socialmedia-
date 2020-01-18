const router = require('express').Router();
// const mongoose = require('mongoose');
const Post = require('../models/post');
const middlewares = require('../utils/middlewares');

router.get('/', middlewares.jsonPagination, (request, response, next) => {
    Post.find({}, (err, posts) => {
        response.json(posts);
    })
        .limit(request.query.limit)
        .skip(request.query.offset);
});

module.exports = router;
