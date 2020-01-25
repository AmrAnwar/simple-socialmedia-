const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./utils/config');
const middlewares = require('./utils/middlewares');

const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const postsRouter = require('./controllers/posts');
const threadsRouter = require('./controllers/threads');

console.log('[*] connecting to MongoDB ...');
mongoose.connect(config.MONGODB_URI, config.DBConfig)
    .then(() => {
        console.log('[+] connected to MongoDB');
    })
    .catch(error => {
        console.error('[!] error connecting to MongoDB:', error.message);
    });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(middlewares.tokenParser);
app.use(middlewares.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/threads', threadsRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;