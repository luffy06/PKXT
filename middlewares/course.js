var mongoose = require('mongoose');
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);

function sortProblem(a, b) {
  return a.problemid - b.problemid;
}

function sortChoice(a, b) {
  return a.choiceid - b.choiceid;
}


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
  });
}

function getProblem(db_prob, j, problist, commentlist, i, res) {
  if (i == problist.length) {
    return res.send({
      status: "success",
      problist: problist,
      commentlist, commentlist
    });
  }
  else if (j == db_prob.length) {
    return res.send({
      stauts: "error",
      errormessage: "部分问题号不存在"
    })
  }

  var problemid = problist[i].problemid;
  var db_problemid = db_prob[j].problemid;
  
  if (db_problemid == problemid) {
    problist[i].description = db_prob[j].description;

    db_prob[j].choice.sort(sortChoice);
    problist[i].choice.sort(sortChoice);

    for (var k = 0, g = 0; k < db_prob[j].choice.length && g < problist[i].choice.length; ) {
      if (db_prob[j].choice[k].choiceid == problist[i].choice[g].choiceid) {
        problist[i].choice[g].choicedesc = db_prob[j].choice[k].choicedesc;
        g++;
        k++;
      }
      else if (db_prob[j].choice[k].choiceid > problist[i].choice[g].choiceid) {
        return res.send({
          status: "error",
          errormessage: "问题 " + problemid + " 中选项号" + problist[i].choice[g].choiceid + " 不存在"
        })
      }
      else {
        k++;
      }
    }

    i = i + 1;
  }
  else if (db_problemid > problemid) {
    return res.send({
      status: "error",
      errormessage: "问题号 " + problemid + " 不存在"
    })
  }
  getProblem(db_prob, j + 1, problist, commentlist, i, res);
}

exports.getinfo = function(req, res) {
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var userid = req.session.user.loginid;
  var role = req.session.user.role;

  var default_course = new Course();
  default_course.courseid = "1";
  default_course.coursename = "计算机网络";
  
  var userdata = new Array();
  var name = new Array();
  name[0] = "root";
  name[1] = "root";
  name[2] = "root";
  for (var i = 0; i < 3; i++) {
    userdata[i] = {};
    userdata[i].classid = i + 1;
    userdata[i].userid = name[i];
    var problem = new Array();
    for (var j = 0; j < 4; j++) {
      problem[j] = {};
      problem[j].problemid = j + 1;
      problem[j].description = "你认为哪一部分最难懂？";
      problem[j].choice = new Array();
      problem[j].choice[0] = {};
      problem[j].choice[0].choiceid = 1;
      problem[j].choice[0].choicedesc = "网络层";
      problem[j].choice[1] = {};
      problem[j].choice[1].choiceid = 2;
      problem[j].choice[1].choicedesc = "物理层";
      problem[j].choice[2] = {};
      problem[j].choice[2].choiceid = 3;
      problem[j].choice[2].choicedesc = "传输层";
      problem[j].choice[3] = {};
      problem[j].choice[3].choiceid = 4;
      problem[j].choice[3].choicedesc = "表示层";
    }
    userdata[i].problem = new Array();
    userdata[i].problem = problem;
  }
  default_course.userdata = new Array();
  default_course.userdata = userdata;

  Course.findByCourseId(default_course.courseid, function(err, db_course) {
    if (err) {
      res.send({
        status: "error",
        errormessage: err
      })
    }

    if (db_course == null) {
      default_course.save(function(err, rr) {
        if (err) {
          res.send({
            status: "error",
            errormessage: err
          })
        }
      })
    }
  });

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

    var message;
    if (res_courselist.length == 0) {
      message = "无课堂";
    }
    else {
      message = "该课程中的课堂均已评过，前往未完成页面查看未评完的课程";
    }

    Selection.findByUserIdAndCourseId(userid, 
      req_courseid, function(err, db_data) {
      if (err) {
        console.log(err);
        return res.send({
          status: "error",
          errormessage: err
        })
      }
      
      if (db_data != null) {
        for (var i = 0; i < res_courselist.length;) {
          var classid = res_courselist[i].classid;
          var ind = -1;
          for (var j = 0; j < db_data.selectiondata.length; j++) {
            if (db_data.selectiondata[j].courseid == req_courseid &&
              db_data.selectiondata[j].classid == classid) {
              ind = j;
              break;
            }
          }
          if (ind != -1) {
            res_courselist.splice(i, 1);
          }
          else {
            i++;
          }
        }
      }
  
      if (res_courselist.length == 0) {
        return res.send({
          stauts: "error",
          errormessage: message
        })
      }

      getUser(res_courselist, 0, res);
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
  var edit = req.body.edit;
  if (edit == null)
    edit = req.query.edit;
  var userid = req.session.user.loginid;


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

    var pid = 1;
    if (edit == 0) {
      Selection.findByUserIdAndCourseId(userid, req_courseid, 
        function(err, db_data) {
        if (err) {
          return res.send({
            status: "error",
            errormessage: err
          });
        }

        if (db_data != null) {
          var user_data = null;
          for (var i = 0; i < db_data.selectiondata.length; i++) {
            if (db_data.selectiondata[i].courseid == req_courseid &&
              db_data.selectiondata[i].classid == req_classid) {
              user_data = db_data.selectiondata[i];
              break;
            }
          }
          if (user_data != null) {
            if (user_data.finished == true) {
              return res.send({
                status: "error",
                errormessage: "这门课你已经评过了"
              })
            }
            else {
              problemlist.sort(sortProblem);
              user_data.problem.sort(sortProblem);
              var i = 0, j = 0, del = 0;
              while (i < problemlist.length && j < user_data.problem.length) {
                if (problemlist[i].problemid == user_data.problem[j].problemid) {
                  problemlist.splice(i, 1);
                  pid++;
                  // i++;
                  j++;
                }
                else if (problemlist[i].problemid < user_data.problem[j].problemid) {
                  i++;
                }
                else {
                  j++;
                }
              }
              return res.send({
                status: "success",
                title: "ProblemList",
                problist: problemlist,
                startpid: pid
              });
            }
          }
        }
        return res.send({
          status: "success",
          title: "ProblemList",
          problist: problemlist,
          startpid: pid
        });
      })
    }
    else {
      return res.send({
        status: "success",
        title: "ProblemList",
        problist: problemlist,
        startpid: pid
      });
    }
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
    var j = 0;
    for (var i = 0; i < courselist.length; i++) {
      var course = courselist[i];
      for (var k = 0; k < course.userdata.length; k++) {
        if (course.userdata[k].userid == userid) {
          var item_course = {};
          item_course.courseid = course.courseid;
          item_course.coursename = course.coursename;
          item_course.classid = course.userdata[k].classid;
          res_courselist[j] = item_course;
          j = j + 1;
        }
      }
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
      problem.problemid = userdata[index].problem[length - 1].problemid;
      problem.problemid++;
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
      // rearrange problemid & low efficiency
      // for (var i = 0; i < course.userdata[index].problem.length; i++) {
      //   course.userdata[index].problem[i].problemid = i + 1;
      // }
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
        status: "success"
      })
    });
  });
}

exports.getsummary = function(req, res) {
  console.log("in getsummary");
  var req_courseid = req.body.courseid;
  if (req_courseid == null)
    req_courseid = req.query.courseid;
  var req_classid = req.body.classid;
  if (req_classid == null)
    req_classid = req.query.classid;
  var problist = new Array();
  var commentlist = new Array();
  var data = new Array();
  Selection.findByCourseIdAndClassId(req_courseid, req_classid, function(err, db_data) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }

    if (db_data == null) {
      return res.send({
        status: "error",
        errormessage: "还未有学生评课"
      })
    }

    console.log("db_data not null");
    for (var i = 0, k = 0; i < db_data.length; i++) {
      for (var j = 0; j < db_data[i].selectiondata.length; j++) {
        if (db_data[i].selectiondata[j].courseid == req_courseid && 
          db_data[i].selectiondata[j].classid == req_classid) {
          data[k++] = db_data[i].selectiondata[j];
        }
      }
    }

    var totalprob = 0;
    for (var i = 0; i < data.length; i++) {
      commentlist[i] = data[i].comment;
      var problem = data[i].problem;
      problem.sort(sortProblem);
      for (var j = 0; j < problem.length; j++) {
        var index = -1;
        if (problist.length > 0) {
          for (var k = 0; k < problist.lenght; k++) {
            if (problist[k].problemid == problem[j].problemid) {
              index = k;
              break;
            }
          }
        }

        if (index == -1) {
          problist[totalprob] = {};
          problist[totalprob].problemid = problem[j].problemid;
          problist[totalprob].choice = new Array();
          index = totalprob;
          totalprob = totalprob + 1;
        }

        var chindex = -1;
        for (var k = 0; k < problist[index].choice.length; k++) {
          if (problist[index].choice[k].choiceid == problem[j].choiceid)
            chindex = k;
        }

        if (chindex == -1) {
          var length = problist[index].choice.length;
          problist[index].choice[length] = {};
          problist[index].choice[length].choiceid = problem[j].choiceid;
          problist[index].choice[length].percent = 1;
          problist[index].avgtimecost = problem[j].costtime;
          console.log(problem[j].costtime);
        }
        else {
          problist[index].choice[chindex].percent++;
          problist[index].avgtimecost += problem[j].costtime;
        }
      }
    }

    for (var i = 0; i < problist.length; i++) {
      var sum = 0;
      for (var j = 0; j < problist[i].choice.length; j++)
        sum += problist[i].choice[j].percent;
      problist[i].avgtimecost /= (1.0 * sum);
      for (var j = 0; j < problist[i].choice.length; j++) {
        problist[i].choice[j].percent /= (1.0 * sum);
      }
    }

    console.log("problist:");
    console.log(problist);

    Course.findByCourseId(req_courseid, function(err, db_course) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        })
      }

      if (db_course == null) {
        return res.send({
          stauts: "error",
          errormessage: req_courseid + " 不存在"
        })
      }

      var index = -1;
      for (var i = 0; i < db_course.userdata.length; i++) {
        if (req_classid == db_course.userdata[i].classid) {
          index = i;
          break;
        }
      }

      if (index == -1) {
        console.log(req_classid + " doesn't exist!");
        return res.send({
          status: "error",
          errormessage: req_classid + " doesn't exist!"
        })
      }

      var db_prob = db_course.userdata[index].problem;
      db_prob.sort(sortProblem);
      problist.sort(sortProblem);

      getProblem(db_prob, 0, problist, commentlist, 0, res);      
    }) 
  })
}