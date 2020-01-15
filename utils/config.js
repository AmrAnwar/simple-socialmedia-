require('dotenv').config();

// mongoose configuration
const DBConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.MONGODB_TEST_URI;
}

module.exports = {
    DBConfig,
    PORT,
    MONGODB_URI,
};