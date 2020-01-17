const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const app = require('../app');
const helper = require('./helper');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});

    const users = helper.initialUsers.map(user => {
        return new User({
            username: user.username,
            email: user.email,
            hash: bcrypt.hashSync(user.password, 8),
            posts: [],
        }).save();
    });

    await Promise.all(users);
});

test('successful login results in 200 OK and returns a token', async () => {
    const credentials = {
        username: 'user1',
        password: '456789123',
    };

    const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(200)
        .expect('Content-Type', /json/);

    expect(response.body.token).toBeDefined();
});

describe('Wrong Credentials', () => {
    test('missing password results in 401 unauthorized', async () => {
        const response = await api
            .post('/api/login')
            .send({ username: 'user1' })
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe('missing username or password');
    });

    test('missing username results in 401 unauthorized', async () => {
        const response = await api
            .post('/api/login')
            .send({ password: '123456' })
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe('missing username or password');
    });

    test('incorrect password results in 401 unauthorized', async () => {
        const credentials = {
            username: 'user1',
            password: '123456'
        };

        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe('invalid username or password');
    });

    test('incorrect username results in 401 unauthorized', async () => {
        const credentials = {
            username: 'not_existing',
            password: '123456'
        };

        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe('invalid username or password');
    });
});

afterAll(() => {
    mongoose.connection.close();
});