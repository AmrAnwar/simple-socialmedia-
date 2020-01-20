const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const helper = require('./helper');

const api = supertest(app);

beforeEach(async () => {
    await helper.initializeUsers();
});

test('GET request returns correct number of users in JSON format', async () => {
    const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/);

    const currentUsers = await helper.usersInDB();
    expect(response.body.length).toBe(currentUsers.length);
});

test('valid POST requests add a new user and return 201 created', async () => {
    const usersBefore = await helper.usersInDB();

    const newUser = {
        username: 'user_new',
        password: '12345678',
        email: 'user_new@user.com',
    };

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /json/);

    expect(response.body.username).toBe(newUser.username);
    expect(response.body.email).toBe(newUser.email);

    const usersAfter = await helper.usersInDB();
    expect(usersAfter.length).toBe(usersBefore.length + 1);

    const usernames = usersAfter.map(user => user.username);
    expect(usernames).toContain(newUser.username);

    const emails = usersAfter.map(user => user.email);
    expect(emails).toContain(newUser.email);
});

//
// return a test function that perform a POST request
// to '/api/users' with the new user payload expecting
// that the request will fail with 400 bad request and
// the response body will contain a certain message.
//
const invalidNewUser = (newUser, message) => {
    return async () => {
        const usersBefore = await helper.usersInDB();

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain(message);

        const usersAfter = await helper.usersInDB();
        expect(usersBefore.length).toBe(usersAfter.length);
    };
};

describe('Invalid POST Requests', () => {
    test('missing password results in 400 bad request',
        invalidNewUser({
            username: 'user_new',
            email: 'user_new@user.com',
        }, 'missing password')
    );

    test('missing username results in 400 bad request',
        invalidNewUser({
            email: 'user_new@user.com',
            password: '123456789',
        }, 'Path `username` is required')
    );

    test('missing email results in 400 bad request',
        invalidNewUser({
            username: 'user_new',
            password: '123456789',
        }, 'Path `email` is required')
    );

    test('short password results in 400 bad request',
        invalidNewUser({
            username: 'user_new',
            email: 'user_new@user.com',
            password: '123',
        }, 'password must be at least six characters long')
    );

    test('short username results in 400 bad request',
        invalidNewUser({
            username: 'us',
            email: 'user_new@user.com',
            password: '123456789',
        }, 'shorter than the minimum allowed')
    );

    test('malformed username results in 400 bad request (1)',
        invalidNewUser({
            username: '12zyx',
            email: 'user_new@user.com',
            password: '123456789',
        }, 'invalid username')
    );

    test('malformed username results in 400 bad request (2)',
        invalidNewUser({
            username: 'new user',
            email: 'user_new@user.com',
            password: '123456789',
        }, 'invalid username')
    );

    test('malformed username results in 400 bad request (3)',
        invalidNewUser({
            username: '$ab$',
            email: 'user_new@user.com',
            password: '123456789',
        }, 'invalid username')
    );

    test('malformed email results in 400 bad request (1)',
        invalidNewUser({
            username: 'user_new',
            email: 'no_at_sign',
            password: '123456789',
        }, 'invalid email')
    );

    test('malformed email results in 400 bad request (2)',
        invalidNewUser({
            username: 'user_new',
            email: 'no@domain',
            password: '123456789',
        }, 'invalid email')
    );
});

afterAll(() => {
    mongoose.connection.close();
});