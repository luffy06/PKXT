var mongoose = require('mongoose');
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.getinfo = function(req, res) {
  var req_courseid = req.body.courseid;
  var req_classid = req.body.classid;
  Course.findOne({courseid: req_courseid}, function(err, course) {
    if (err) {
      console.log("Error Message in middlewares/course.js: " + err);
      return res.render('error', {
        ErrMes: err
      });
    }

    // course is not exist
    if (!course) {
      console.log("Error Message in middlewares/course.js: " + req_courseid + " is not exist!");
      return res.render('error', {
        ErrMes: err
      });
    }

    var userid = -1;
    var userdata = course['userdata'];
    for (var i = 0; i < userdata.size(); i++) {
      if (userdata[i].classid == req_classid) {
        userid = userdata[i].userid;
        break;
      }
    }
    // class id is wrong
    if (userid == -1) {
      console.log("Error Message in middlewares/course.js: " + req_classid + " is not exist!");
      return res.render('error', {
        ErrMes: err
      })
    }

    // add session
    req.session.problem = course['problem'];

    User.findOne({userid: userid}, function(err, user) {
      console.log("Error Message in middlewares/course.js: " + err);
      return res.render('error', {
        ErrMes: err
      });
  
      res.render('coureseinfo', {
        title: CoureseInfo,
        coursername: course['coursername'],
        teacher: user['name']
      })
    });

  });
};