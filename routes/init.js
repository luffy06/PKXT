var express = require('express');
var Init = express.Router();
var init = require('../middlewares/init');

Init.post('/user/logout', init.initdata)

module.exports = Init;