const mongoose = require('mongoose');
const supertest = require('supertest');

// const Thread = require('../models/thread');
const app = require('../app');
const helper = require('./helpers/thread_helper');

const api = supertest(app);

beforeEach(async () => {
    await helper.initThreads();
});

test('get /api/threads/:threadId', async () => {
    const cThread = (await helper.threadsInDB())[0];
    const response = await api
        .get(`/api/threads/${cThread.id}`)
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.text).toContain('testing thread');
});

afterAll(() => {
    mongoose.connection.close();
});