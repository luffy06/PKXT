var express = require('express');
var course = require('../middlewares/course');
var router = express.Router();

router.get('/courseinfo', course.getinfo)


module.exports = router;