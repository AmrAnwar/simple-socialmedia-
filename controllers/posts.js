const postRouter = require('express').Router();

const Post = require('../models/post');
const Thread = require('../models/thread');
const middlewares = require('../utils/middlewares');


postRouter.param('postId', async (request, respose, next, postId) => {
    console.log('hello that\'s okey', postId);
    try {
        const post = await Post.findById(postId);//.populate('threads');
        if (!post) {
            next(new Error('No Post with that id'));
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



postRouter.post('/',middlewares.getUser, async(request, response) => {
    const { body } = request.body;
    if ( !body ) {
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

//Threads


postRouter.get('/:postId/threads', async (request, response, next) => {
    try {
        const currentPost = request.post;
        response.status(200).json(currentPost.threads);
    } catch (err) {
        next(err);
    }
});


postRouter.post('/:postId/threads', async (request, response, next) => {
    try {
        const currentPost = request.post;
        //request.body.author = request.user._id;
        request.body.parentPost = currentPost._id;
        const newThread = await Thread.create(request.body);
        currentPost.threads.push(newThread._id);
        await currentPost.save();
        response.status(201).json(newThread);
    } catch (err) {
        next(err);
    }
});


postRouter.get('/:postId/threads/:threadId', async (request, response, next) => {
    try {
        const currentThread = await Thread.findById(request.params.threadId);
        //check the thread is exist and it's on the same post
        if (currentThread
        && request.post._id.equals(currentThread._id)
        ) {
            response.status(200).json(currentThread);
        } else {
            next(new Error('No thread with that id'));
        }
    } catch (err) {
        next(err);
    }
});


module.exports = postRouter;
