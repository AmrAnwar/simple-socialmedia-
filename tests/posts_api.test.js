const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const Post = require('../models/post');
const User = require('../models/user');
const app = require('../app');
const helper = require('./helper');

const api = supertest(app);

beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    const author = await new User({
        username: 'user1',
        email: 'user1@user.com',
        hash: bcrypt.hashSync('456789123', 8),
        posts: [],
    }).save();

    const posts = helper.initialPosts.map(post => {
        return new Post({
            body: post.body,
            threads: [],
            author: author,
        }).save();
    });

    await Promise.all(posts);
});

test('get /api/posts', async () => {
    const response = await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.text).toContain('testing post4');
    expect(typeof response.body).toEqual(typeof []);
    expect(response.body).not.toEqual([]);
    expect(response.body.length).toBe(10);
});

test('get /api/posts?limit=5', async () => {
    const response = await api
        .get('/api/posts?limit=5')
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.body.length).toBe(5);
});

afterAll(() => {
    mongoose.connection.close();
});