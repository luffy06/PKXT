var mongoose = require('mongoose');
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.getinfo = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;

  Course.findOne({courseid: req_courseid}, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course is not exist
    if (!course) {
      console.log("middlewares/course.js: " + req_courseid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: req_courseid + " is not exist!"
      });
    }
    // get course
    var res_course = {};
    res_course.courseid = course.courseid;
    res_course.coursername = course.coursername;

    // get teachername
    var teachername;
    var userid = -1;
    var userdata = course.userdata;
    for (var i = 0; i < userdata.size(); i++) {
      if (userdata[i].classid == req_classid) {
        userid = userdata[i].userid;
        break;
      }
    }
    // classid is wrong
    if (userid == -1) {
      console.log("middlewares/course.js: " + req_classid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: req_classid + " is not exist!"
      })
    }

    User.getHashedId(userid, function(err, id) {
      User.findOne({id: id}, function(err, user) {
        if (err) {
          return res.send({
            status: "error",
            errormessage: err
          });
        }
    
        return res.send({
          status: "success",
          title: "CoureseInfo",
          course: res_course,
          teachername: user.name
        })
      });
    });
  });
};

exports.getproblemlist = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;

  // code repeat too much
  // too bad
  Course.findOne({courseid: req_courseid}, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course is not exist
    if (!course) {
      console.log("middlewares/course.js: " + req_courseid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: req_courseid + " is not exist!"
      });
    }

    var index = -1;
    var userdata = course.userdata;
    for (var i = 0; i < userdata.size(); i++) {
      if (userdata[i].classid == req_classid) {
        index = i;
        break;
      }
    }
    // classid is wrong
    if (index == -1) {
      console.log("middlewares/course.js: " + req_classid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: req_classid + " is not exist!"
      })
    }

    // get problem list
    var problemlist = course.userdata[i].problem;

    return res.send({
      stauts: "success",
      title: "ProblemList",
      problist: problemlist
    });
  });
}

exports.getcourselist = function(req, res) {
  var userid = req.session.user.id;
  Course.fetchByUserId(userid, function(err, courselist) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }

    // get course list
    var res_courselist = new Array();
    for (var i = 0; i < courselist.size(); i++) {
      var course = courselist[i];
      res_courselist[i] = {};
      res_courselist[i].courseid = course.courseid;
      res_courselist[i].coursename = course.coursename;
    }

    return res.send({
      status: "success",
      title: "CourseList",
      courselist: res_courselist
    })
  });
}

exports.editproblem = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;
  Course.findOne({courseid: req_courseid}, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course is not exist
    if (!course) {
      console.log("middlewares/course.js: " + req_courseid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: req_courseid + " is not exist!"
      });
    }

    var index = -1;
    var userdata = course.userdata;
    for (var i = 0; i < userdata.size(); i++) {
      if (userdata[i].classid == req_classid) {
        index = i;
        break;
      }
    }

    if (index == -1) {
      console.log("middlewares/course.js: " + req_classid + " is not exist!");
      return res.send({
        status: "error",
        errormessage: classid + "is not exist!"
      })
    }

    var action = req.query.action;
    if (action == "add") {
      var problem = req.body.prob;
      var size = userdata[index].problem.size();
      problem.problemid = size;
      var choice = problem.choice;
      for (var i = 0; i < choice.size(); i++)
        problem.choice[i].choiceid = i + 1;
      course.userdata[index].problem.splice(size - 1, 0, problem);
    }
    else if (action == "update") {
      var problem = req.body.prob;
      var problemid = req.query.problemid;
      var ind = -1;
      for (var i = 0; i < userdata[index].problem.size(); i++) {
        if (userdata[index].problem[i].problemid == problemid) {
          ind = i;
          break;
        }
      }
      if (ind == -1) {
        return res.send({
          stauts: "error",
          errormessage: problemid + " is not exist"
        })
      }
      course.userdata[index].problem.splice(ind, 1, probelm);
    }
    else if (action == "delete") {
      var problemid = req.query.problemid;
      var ind = -1;
      for (var i = 0; i < userdata[index].problem.size(); i++) {
        if (userdata[index].problem[i].problemid == problemid) {
          ind = i;
          break;
        }
      }
      if (ind == -1) {
        return res.send({
          stauts: "error",
          errormessage: problemid + " is not exist"
        })
      }
      course.userdata[index].problemid.splice(ind, 1);
    }
    else {
      console.log("cannot distinguish action: " + action);
    }
    course.save(function(err, course) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        });
      }
      return res.send({
        stauts: "success"
      })
    });
  });
}