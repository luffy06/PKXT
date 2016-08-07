var express = require('express');
var user = require('../middlewares/user');
var User = express.Router();

User.post('/login', user.login)
    
module.exports = User;
