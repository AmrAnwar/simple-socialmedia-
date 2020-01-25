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

    return response.status(200).json(posts_query);
});



//theards code


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
        //check the thread is exist and it's on the same post [need refactor]
        if (currentThread
        //&& currentPost
        //     .threads.find(id => id.equals(currentThread._id))
        ) {
            response.status(200).json(currentThread);
        } else {
            next(new Error('No thread with that id'));
        }
    } catch (err) {
        next(err);
    }
});

postRouter.post('/:postId/threads/:threadId', async (request, response, next) => {
    try {
        const currentThread = await Thread.findById(request.params.threadId);
        // const currentPost = request.post;
        //check the thread is exist and it's on the same post [need refactor]
        if (currentThread
        //&& currentPost
        //     .threads.find(id => id.equals(currentThread._id))
        ) {

            //request.body.author = request.user._id;
            const newThread = await Thread.create(request.body);
            currentThread.threads.push(newThread._id);
            await currentThread.save();
            response.status(201).json(newThread);
        } else {
            next(new Error('No thread with that id'));
        }
    } catch (err) {
        next(err);
    }
});

module.exports = postRouter;
