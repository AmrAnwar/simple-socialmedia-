const bcrypt = require('bcrypt');

const User = require('../models/user');
const usersRouter = require('express').Router();

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('posts', { body: 1 });

    response.send(users.map(user => user.toJSON()));
});

usersRouter.post('/', async (request, response, next) => {
    const { username, email, password } = request.body;

    if (!password) {
        return response.status(400).send({
            error: 'missing password',
        });
    }

    if (password.length < 6) {
        return response.status(400).send({
            error: 'password must be at least six characters long',
        });
    }

    try {
        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            username, email, hash
        });

        const savedUser = await user.save();
        response.status(201).send(savedUser);
    } catch (exception) {
        next(exception);
    }
});

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
        .populate('posts', { body: 1 });

    if (user) {
        response.json(user.toJSON());
    } else {
        response.status(404).end();
    }
});

module.exports = usersRouter;