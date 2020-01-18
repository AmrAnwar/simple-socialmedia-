
var router = require('express').Router();

router.use('/api/posts', require('./posts'));

module.exports = router;