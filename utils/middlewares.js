const jwt = require('jsonwebtoken');
const config = require('./config');

function requestLogger(request, response, next) {
    console.log('Method:', request.method);
    console.log('Host:', request.hostname);
    console.log('Body:', request.body);
    console.log('======');
    next();
}

function tokenParser(request, response, next) {
    const auth = request.get('authorization');

    if (auth && auth.toLowerCase().startsWith('bearer')) {
        request.token = auth.substring(7);
    }

    next();
}

function unknownEndpoint(request, response) {
    response.status(404).json({
        error: 'unknown endpoint',
    });
}

function errorHandler(error, request, response, next) {
    console.error(`[!] ${error.name}: ${error.message}`);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'malformed id' });
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
        return response.status(400).json({ error: 'invalid token' });
    }

    next(error);
}

function jsonPagination(request, response, next){
    request.query.limit = request.query.limit ?
        Number(request.query.limit) : 10;

    request.query.offset = request.query.offset ?
        Number(request.query.offset) : 0;

    next();
}

function getUser(request, response, next){
    // TODO? hanlde error
    request.user = jwt.verify(request.token, config.SECRET);
    next();
}

module.exports = {
    requestLogger,
    tokenParser,
    unknownEndpoint,
    errorHandler,
    jsonPagination,
    getUser,
};