const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./helpers/post_helper');

const api = supertest(app);

beforeEach(async () => {
    await helper.initializePosts();
});

test('get /api/posts', async () => {
    const response = await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.text).toContain('testing post4');
    expect(typeof response.body.posts).toEqual(typeof []);
    expect(response.body.posts).not.toEqual([]);
    expect(response.body.posts.length).toBe(10);
});

test('get /api/posts?limit=5', async () => {
    const response = await api
        .get('/api/posts?limit=5')
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.body.posts.length).toBe(5);
});

afterAll(() => {
    mongoose.connection.close();
});