var express = require('express');
var Index = express.Router();
var index = require('../middlewares/index');

Index.post('/', index.autologin)
    .post('/index', index.autologin)

module.exports = Index;