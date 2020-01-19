const router = require('express').Router();
// const mongoose = require('mongoose');
const Post = require('../models/post');
const middlewares = require('../utils/middlewares');
const postRouter = require('express').Router();

postRouter.get('/', middlewares.jsonPagination, async (request, response, next) => {
    const posts_query = await  Post.find({})
                        .limit(request.query.limit).skip(request.query.offset);
    return response.status(200).json(posts_query);
});

module.exports = postRouter;
