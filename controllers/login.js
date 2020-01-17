const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../utils/config');
const User = require('../models/user');
const loginRouter = require('express').Router();

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    if (!username || !password) {
        return response.status(401).json({
            error: 'missing username or password',
        });
    }

    const user = await User.findOne({ username });
    const correctPassword  = user &&
        await bcrypt.compare(password, user.hash);

    if (!correctPassword) {
        return response.status(401).json({
            error: 'invalid username or password',
        });
    }

    const tokenObject = {
        username,
        id: user._id,
    };

    const token = await jwt.sign(tokenObject, config.SECRET);

    response.status(200).json({
        username,
        token,
    });
});

module.exports = loginRouter;