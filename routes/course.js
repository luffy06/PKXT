var express = require('express');
var course = require('../middlewares/course');
var Course = express.Router();

Course.get('/courseinfo', course.getinfo)
      

module.exports = Course;