const Post = require('../../models/post');
const User = require('../../models/user');

const { oneUserInDb } = require('./user_helper');

const initialPosts = [
    {
        body: 'testing post1',
    },
    {
        body: 'testing post2',
    },
    {
        body: 'testing post3',
    },
    {
        body: 'testing post4',
    },
    {
        body: 'testing post5',
    },
    {
        body: 'testing post6',
    },
    {
        body: 'testing post7',
    },
    {
        body: 'testing post8',
    },
    {
        body: 'testing post9',
    },
    {
        body: 'testing post10',
    },
];


const initializePosts = async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    const author = await oneUserInDb();

    const posts = initialPosts.map(post => {
        return new Post({
            body: post.body,
            threads: [],
            author: author.id,
        }).save();
    });

    await Promise.all(posts);
};

const postsInDB = async () => {
    const posts = await Post.find({});
    return posts.map(post => post.toJSON());
};



module.exports = {
    initializePosts,
    postsInDB,
    initialPosts,
};