const threadRouter = require('express').Router();

const Thread = require('../models/thread');
//const middlewares = require('../utils/middlewares');



threadRouter.param('threadId', async (request, respose, next, threadId) => {
    console.log('hello that\'s okey', threadId);
    try {
        const thread = await Thread.findById(threadId);
        if (!thread) {
            next(new Error('No Post with that id'));
        } else {
            request.thread = thread;
            next();
        }
    } catch (err) {
        next(err);
    }
});



//case reply to exist thread
threadRouter.post('/:threadId', async (request, response, next) => {
    try {
        const currentThread = request.thread;
        //request.body.author = request.user._id;
        request.body.parentPost = currentThread.parentPost;
        request.body.parentThread = currentThread._id;
        const newThread = await Thread.create(request.body);
        currentThread.threads.push(newThread._id);
        await currentThread.save();
        response.status(201).json(newThread);
    } catch (err) {
        next(err);
    }
});


//TODO add thread update delete and Get


module.exports = threadRouter;
