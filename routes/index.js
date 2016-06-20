var express = require('express');
var Index = express.Router();
var index = require('../middleware/index');

Index.get('/', index.autoloign)
    .get('/index', index.autoloign)

module.exports = Index;