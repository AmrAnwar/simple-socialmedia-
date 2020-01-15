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
        request.token = auth.subString(7);
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

module.exports = {
    requestLogger,
    tokenParser,
    unknownEndpoint,
    errorHandler,
};