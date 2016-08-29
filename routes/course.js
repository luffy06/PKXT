var express = require('express');
var course = require('../middlewares/course');
var selection = require('../middlewares/selection');
var Course = express.Router();


Course.post('/courseinfo', course.getinfo)
      .post('/courselist', course.getcourselist)
      .post('/assesscourse', course.getproblemlist)
      .post('/problemlist', course.getproblemlist)
      .post('/editproblem', course.editproblem)
      .post('/unfinished', selection.getunfinished)
      .post('/savedata', selection.savadata);

module.exports = Course;