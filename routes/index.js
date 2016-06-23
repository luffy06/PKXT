var express = require('express');
var Index = express.Router();
var index = require('../middlewares/index');

Index.get('/', index.autologin)
    .get('/index', index.autologin)

module.exports = Index;