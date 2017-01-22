var express = require('express');
var init = require('../middlewares/init');
var user = require('../middlewares/user');
var User = express.Router();
var Init = express.Router();


User.post('/login', user.login)
    .post('/logout', user.logout)
    // .post('/logout', init.initdata)
    
module.exports = User;
