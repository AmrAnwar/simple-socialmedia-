const postRouter = require('express').Router();

const Post = require('../models/post');
const middlewares = require('../utils/middlewares');

postRouter.get('/', middlewares.jsonPagination, async (request, response) => {
    const posts_query = await Post.find({})
        .limit(request.query.limit)
        .skip(request.query.offset)
        .sort({ createdAt: 'desc' });

    return response.status(200).json(posts_query);
});

module.exports = postRouter;
