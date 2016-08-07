var express = require('express');
var course = require('../middlewares/course');
var selection = require('../middlewares/selection');
var Course = express.Router();


Course.get('/courseinfo', course.getinfo)
      .get('/assesscourse', course.getproblemlist)
      .get('/courselist', course.getcourselist)
      .get('/problemlist', course.getproblemlist)
      .get('/editproblem', course.editproblem)
      .get('/unfinished', selection.getunfinished)
      .get('/savedata', selection.savadata);

module.exports = Course;