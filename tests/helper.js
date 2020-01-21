const bcrypt = require('bcrypt');

const User = require('../models/user');
const Post = require('../models/post');

const initialUsers = [
    {
        username: 'user1',
        email: 'user1@user.com',
        password: '456789123',
    },
    {
        username: 'user2',
        email: 'user2@user.com',
        password: '753951461',
    },
    {
        username: 'user3',
        email: 'user3@user.com',
        password: '741258963',
    },
    {
        username: 'user4',
        email: 'user4@user.com',
        password: '785691234',
    }
];

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
]

const initializeUsers = async () => {
    await User.deleteMany({});

    const users = initialUsers.map(user => {
        return new User({
            username: user.username,
            email: user.email,
            hash: bcrypt.hashSync(user.password, 8),
            posts: [],
        }).save();
    });

    await Promise.all(users);
};

const usersInDB = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
};


module.exports = {
    initializeUsers,
    usersInDB,
    initialPosts,
};