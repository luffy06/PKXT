var mongoose = require('mongoose');
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);

function getUser(res_courselist, i, res) {
  var loginid = res_courselist[i].teachername;
  User.findOneById(loginid, function(err, user) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }
    if (user == null) {
      return res.send({
        status: "error",
        errormessage: loginid + " doesn't exist!"
      });
    }
    res_courselist[i].teachername = user.name;
    Selection.checkFinishedByUserIdAndCourseId(loginid, 
      res_courselist[i].courseid, res_courselist[i].classid, 
      function(err, db_data){
      console.log("db_data " + db_data);
      if (db_data != null && db_data.selectiondata.length != 0
          && db_data.selectiondata[0].finished == true) {
        res_courselist.splice(i, 1);
        i = i - 1;
      }

      if (i == res_courselist.length - 1) {
        return res.send({
          status: "success",
          title: "CoureseInfo",
          courselist: res_courselist
        })
      }
      else {
        getUser(res_courselist, i + 1, res);
      }
    })
  });
}

exports.getinfo = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var userid = req.session.user.loginid;
  var role = req.session.user.role;

  // var default_course = new Course();
  // default_course.courseid = "1";
  // default_course.coursename = "计算机网络";
  
  // var userdata = new Array();
  // var name = new Array();
  // name[0] = "root";
  // name[1] = "root";
  // name[2] = "root";
  // for (var i = 0; i < 3; i++) {
  //   userdata[i] = {};
  //   userdata[i].classid = i + 1;
  //   userdata[i].userid = name[i];
  //   var problem = new Array();
  //   for (var j = 0; j < 4; j++) {
  //     problem[j] = {};
  //     problem[j].problemid = j + 1;
  //     problem[j].description = "你认为哪一部分最难懂？";
  //     problem[j].choice = new Array();
  //     problem[j].choice[0] = {};
  //     problem[j].choice[0].choiceid = 1;
  //     problem[j].choice[0].choicedesc = "网络层";
  //     problem[j].choice[1] = {};
  //     problem[j].choice[1].choiceid = 2;
  //     problem[j].choice[1].choicedesc = "物理层";
  //     problem[j].choice[2] = {};
  //     problem[j].choice[2].choiceid = 3;
  //     problem[j].choice[2].choicedesc = "传输层";
  //     problem[j].choice[3] = {};
  //     problem[j].choice[3].choiceid = 4;
  //     problem[j].choice[3].choicedesc = "表示层";
  //   }
  //   userdata[i].problem = new Array();
  //   userdata[i].problem = problem;
  // }
  // default_course.userdata = new Array();
  // default_course.userdata = userdata;

  // Course.findByCourseId("1", function(err, db_course) {
  //   if (err) {
  //     res.send({
  //       status: "error",
  //       errormessage: err
  //     })
  //   }

  //   if (db_course == null) {
  //     default_course.save(function(err, res) {
  //       if (err) {
  //         res.send({
  //           status: "error",
  //           errormessage: err
  //         })
  //       }
  //     })
  //   }
  // });

  Course.findByCourseId(req_courseid, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course doesn't exist
    if (course == null) {
      return res.send({
        status: "error",
        errormessage: "课堂号 " + req_courseid + " 不存在"
      });
    }

    // get course
    var res_courselist = new Array();
    
    for (var i = 0; i < course.userdata.length; i++) {
      var item_course = {};
      item_course.coursename = course.coursename;
      item_course.courseid = course.courseid;
      item_course.classid = course.userdata[i].classid;
      item_course.teachername = course.userdata[i].userid;
      res_courselist[i] = item_course;
    }

    if (res_courselist.length == 0) {
      return res.send({
        stauts: "error",
        errormessage: "无课堂"
      })
    }

    getUser(res_courselist, 0, res);
  });
};

exports.getproblemlist = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;
  // req_courseid = 1;
  // req_classid = 1;

  // code repeat too much
  // too bad
  Course.findByCourseId(req_courseid, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course doesn't exist
    if (!course) {
      console.log(req_courseid + " doesn't exist!");
      return res.send({
        status: "error",
        errormessage: req_courseid + " doesn't exist!"
      });
    }

    var index = -1;
    var userdata = course.userdata;
    for (var i = 0; i < userdata.length; i++) {
      if (userdata[i].classid == req_classid) {
        index = i;
        break;
      }
    }
    // classid is wrong
    if (index == -1) {
      console.log(req_classid + " doesn't exist!");
      return res.send({
        status: "error",
        errormessage: req_classid + " doesn't exist!"
      })
    }

    // get problem list
    var problemlist = course.userdata[i].problem;
    for (var i = 0; i < problemlist.length; i++) {
      problemlist[i]._id = undefined;
      for (var j = 0; j < problemlist[i].choice.length; j++) {
        problemlist[i].choice[j]._id = undefined;
      }
    }
    console.log("problemlist " + problemlist)

    return res.send({
      status: "success",
      title: "ProblemList",
      problist: problemlist
    });
  });
}

exports.getcourselist = function(req, res) {
  var userid = req.session.user.loginid;
  // userid = "root";

  Course.fetchByUserId(userid, function(err, courselist) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }

    // get course list
    var res_courselist = new Array();
    for (var i = 0; i < courselist.length; i++) {
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

  var action = req.body.type;
  if (action == null)
    action = req.query.type;
  
  Course.findByCourseId(req_courseid, function(err, course) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // course doesn't exist
    if (course == null) {
      console.log(req_courseid + " doesn't exist!");
      return res.send({
        status: "error",
        errormessage: req_courseid + " doesn't exist!"
      });
    }

    var index = -1;
    var userdata = course.userdata;
    for (var i = 0; i < userdata.length; i++) {
      if (userdata[i].classid == req_classid) {
        index = i;
        break;
      }
    }

    if (index == -1) {
      console.log(req_classid + " doesn't exist!");
      return res.send({
        status: "error",
        errormessage: classid + "doesn't exist!"
      })
    }

    var problem = req.body.prob;
    if (problem == null)
      problem = req.query.prob;

    // 1 add 2 update 3 delete
    if (action == 1) { // add
      var length = userdata[index].problem.length;
      problem.problemid = length + 1;
      var choice = problem.choice;
      for (var i = 0; i < choice.length; i++)
        problem.choice[i].choiceid = i + 1;
      course.userdata[index].problem.splice(length, 0, problem);
    }
    else if (action == 2) { // update
      var problemid = problem.problemid;

      var ind = -1;
      for (var i = 0; i < userdata[index].problem.length; i++) {
        if (userdata[index].problem[i].problemid == problemid) {
          ind = i;
          break;
        }
      }
      if (ind == -1) {
        return res.send({
          status: "error",
          errormessage: problemid + " doesn't exist"
        })
      }
      course.userdata[index].problem.splice(ind, 1, problem);
    }
    else if (action == 3) { // delete
      var problemid = problem.problemid;
      var ind = -1;
      for (var i = 0; i < userdata[index].problem.length; i++) {
        if (userdata[index].problem[i].problemid == problemid) {
          ind = i;
          break;
        }
      }
      if (ind == -1) {
        return res.send({
          status: "error",
          errormessage: problemid + " doesn't exist"
        })
      }
      course.userdata[index].problem.splice(ind, 1);
    }
    else {
      console.log("cannot distinguish action: " + action);
    }
    console.log(course.userdata[index].problem);
    course.save(function(err, course) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        });
      }
      return res.send({
        status: "success"
      })
    });
  });
}