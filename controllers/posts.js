const postRouter = require('express').Router();


const Post = require('../models/post');
const Thread = require('../models/thread');
const middlewares = require('../utils/middlewares');


postRouter.param('postId', async (request, respose, next, postId) => {
    console.log('hello that\'s okey', postId);
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return respose.status(404).send('Post not found');
        } else {
            request.post = post;
            next();
        }
    } catch (err) {
        next(err);
    }
});


postRouter.get('/', middlewares.jsonPagination, async (request, response) => {
    const posts_query = await Post.find({})
        .limit(request.query.limit)
        .skip(request.query.offset)
        .sort({ createdAt: 'desc' });

    return response.status(200).json(
        { posts: posts_query }
    );
});



postRouter.post('/',
    middlewares.getUser,
    async (request, response) => {
        const { body } = request.body;
        if (!body) {
            return response.status(401).json({
                error: 'missing post body',
            });
        }
        console.log(request.user);
        let post = await new Post({
            body: body,
            author: request.user.id,
            threads: [],
        }).save();
        return response.status(200).json(
            { post: post }
        );
    });


//operations with one Post

postRouter.get('/:postId', async (request, response) => {
    //ToDo add pagination
    const currentPost = request.post;
    const allThreads = await Thread.find({ parentPost: currentPost._id });
    return response.status(200).json({ post:currentPost, attachedThreads: allThreads });
});


module.exports = postRouter;
