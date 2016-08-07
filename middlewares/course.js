var mongoose = require('mongoose');
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.getinfo = function(req, res) {
  console.log("in getinfo")
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;

  // for test
  // var res_courselist = new Array();

  // for (var i = 0; i < 3; i++) {
  //   var item_course = {};
  //   item_course.coursename = "course.coursename";
  //   item_course.courseid = "course.courseid";
  //   item_course.classid = "userdata[i].classid";
  //   item_course.teachername = "teachername"
  //   res_courselist[i] = item_course;
  // }

  // return res.send({
  //   status: "success",
  //   title: "CoureseInfo",
  //   courselist: res_courselist
  // })

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
    var res_courselist = new Array();
    
    for (var i = 0; i < userdata.size; i++) {
      var item_course = {};
      item_course.coursename = course.coursename;
      item_course.courseid = course.courseid;
      item_course.classid = userdata[i].classid;
      var loginid = userdata[i].userid;
      User.findOneById({loginid: loginid}, function(err, user) {
        if (err) {
          return res.send({
            status: "error",
            errormessage: err
          });
        }
        if (!user) {
          return res.send({
            stauts: "error",
            errormessage: "the teacher id: " + loginid + " of course " 
                        + course.coursename + " in class " 
                        + userdata[i].classid + " is not exist!"
          })
        }
        item_course.teachername = user.name;
      });
      res_courselist[i] = item_course;
    }
    return res.send({
      status: "success",
      title: "CoureseInfo",
      courselist: res_courselist
    })
  });
};

exports.getproblemlist = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;

  // for test
  // var problemlist = new Array();
  // return res.send({
  //   stauts: "success",
  //   title: "ProblemList",
  //   problist: problemlist
  // });

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
    for (var i = 0; i < userdata.size; i++) {
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
  var userid = req.session.user.loginid;

  // for test
  // var res_courselist = new Array();

  // return res.send({
  //   status: "success",
  //   title: "CourseList",
  //   courselist: res_courselist
  // })

  Course.fetchByUserId(userid, function(err, courselist) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }

    // get course list
    var res_courselist = new Array();
    for (var i = 0; i < courselist.size; i++) {
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
  var action = req.query.type;
  
  // for test

  // return res.send({
  //   stauts: "success",
  //   type: action
  // })

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
    for (var i = 0; i < userdata.size; i++) {
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

    // 1 add 2 update 3 delete
    if (action == 1) {
      var problem = req.body.prob;
      var size = userdata[index].problem.size;
      problem.problemid = size;
      var choice = problem.choice;
      for (var i = 0; i < choice.size; i++)
        problem.choice[i].choiceid = i + 1;
      course.userdata[index].problem.splice(size - 1, 0, problem);
    }
    else if (action == 2) {
      var problem = req.body.prob;
      var problemid = req.query.problemid;
      var ind = -1;
      for (var i = 0; i < userdata[index].problem.size; i++) {
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
      return res.send({
        stauts: "success"
      })
    }
    else if (action == 3) {
      var problemid = req.query.problemid;
      var ind = -1;
      for (var i = 0; i < userdata[index].problem.size; i++) {
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
      return res.send({
        stauts: "success"
      })
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