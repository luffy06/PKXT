var express = require('express');
var user = require('../middlewares/user');
var router = express.Router();


router.get('/login', user.login)


module.exports = router;
