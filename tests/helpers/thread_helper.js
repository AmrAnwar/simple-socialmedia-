const Post = require('../../models/post');
const User = require('../../models/user');
const Thread = require('../../models/thread');

const { postsInDB, initializePosts } = require('./post_helper');

const initialThreads = [
    {
        body: 'testing thread1',
    },
    {
        body: 'testing thread2',
    },
    {
        body: 'testing thread3',
    },
    {
        body: 'testing thread4',
    },
    {
        body: 'testing thread5',
    },
    {
        body: 'testing thread6',
    },
    {
        body: 'testing thread7',
    },
    {
        body: 'testing thread8',
    },
    {
        body: 'testing thread9',
    },
    {
        body: 'testing thread10',
    },
];


const initThreads = async () => {
    await Thread.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    await initializePosts();
    const parentPost = (await postsInDB())[0];

    const threads = initialThreads.map(thread => {
        return new Thread({
            body: thread.body,
            parentPost: parentPost.id
        }).save();
    });

    await Promise.all(threads);
};

const threadsWithFirstPost = async () => {
    const parentPost = await postsInDB()[0];
    const threads = await Thread.find({ parentPost: parentPost.id });
    return threads.map(thread => thread.toJSON());
};


const threadsInDB = async () => {
    const threads = await Thread.find({});
    return threads.map(thread => thread.toJSON());
};


module.exports = {
    initThreads,
    threadsInDB,
    initialThreads,
    threadsWithFirstPost
};