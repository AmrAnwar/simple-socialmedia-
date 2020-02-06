const threadRouter = require('express').Router();

const Thread = require('../models/thread');
const Post = require('../models/post');

//const middlewares = require('../utils/middlewares');



threadRouter.param('threadId', async (request, respose, next, threadId) => {
    console.log('hello that\'s okey', threadId);
    try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return respose.status(404).send('Can not find parent Thread');
        } else {
            request.thread = thread;
            next();
        }
    } catch (err) {
        next(err);
    }
});

//Case Create new Thread
threadRouter.post('/', async (request, response, next) => {
    try {
        //request.body.author = request.user._id;
        const postObject = await Post.findById(request.body.parentPost);
        if (!postObject) {
            return response.status(404).send('Post not Found');
        } else {
            const newThread = await Thread.create(request.body);
            postObject.threads.push(newThread._id);
            await postObject.save();
            return response.status(201).json(newThread);
        }
    } catch (err) {
        next(err);
    }
});


threadRouter.get('/:threadId', async (request, response, next) => {
    try {
        const parentThread = request.thread;
        response.status(200).json(parentThread);
    } catch (err) {
        next(err);
    }
});

//Case reply to exist thread

threadRouter.post('/:threadId', async (request, response, next) => {
    try {
        const parentThread = request.thread;
        //request.body.author = request.user._id;
        request.body.parentPost = parentThread.parentPost;
        request.body.parentThread = parentThread._id;
        const newThread = await Thread.create(request.body);
        response.status(201).json(newThread);
    } catch (err) {
        next(err);
    }
});


//TODO add thread update delete and Get


module.exports = threadRouter;
