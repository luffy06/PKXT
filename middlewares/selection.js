var mongoose = require('mongoose');
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var Async = require('async');

// function getCourse(res_courselist, i, selectiondata, j, res) {
//   var item = {};
//   item.courseid = selectiondata[j].courseid;
//   item.classid = selectiondata[j].classid;
//   Course.findByCourseId(item.courseid, function(err, db_course) {
//     if (err) {
//       return res.send({
//         status: "error",
//         errormessage: err
//       })
//     }
//     if (db_course == null) {
//       return res.send({
//         status: "error",
//         errormessage: item.courseid + " doesn't exist"
//       })
//     }
//     var userid = -1;
//     for (var k = 0; k < db_course.userdata.length; k++) {
//       if (db_course.userdata[k].classid == item.classid) {
//         userid = db_course.userdata[k].userid;
//         break;
//       }
//     }
//     if (userid == -1) {
//       return res.send({
//         status: "error",
//         errormessage: "user of " + item.classid + " doesn't exist"
//       })
//     }
//     item.coursename = db_course.coursename;
//     User.findOneById(userid, function(err, db_user) {
//       if (err) {
//         return res.send({
//           status: "error",
//           errormessage: err
//         })
//       }
//       item.teachername = db_user.name;
//       if (selectiondata[j].finished == false) {
//         res_courselist[i] = item;
//         i++;
//       }
//       j++;
//       if (j == selectiondata.length) {
//         return res.send({
//           status: "success",
//           courselist: res_courselist
//         })
//       }
//       else {
//         getCourse(res_courselist, i, selectiondata, j, res);
//       }
//     })
//   });
// }

exports.getunfinished = function(req, res) {
  var user = req.session.user;

  Selection.findByUserId(user.loginid, function(err, selection) {
    var courselist = new Array();
    if (selection == null || selection.selectiondata == null) {
      return res.send({
        status: "success",
        courselist: courselist
      });
    }
    
    var ct = 0;
    Async.each(selection.selectiondata, function(data, next) {
      var item = {};
      item.courseid = data.courseid;
      item.classid = data.classid;
      Course.findByCourseId(item.courseid, function(err, db_course) {
        if (err) {
          return res.send({
            status: "error",
            errormessage: err
          })
        }

        // 课程不存在
        if (db_course == null) {
          return res.send({
            status: "error",
            errormessage: item.courseid + " doesn't exist"
          })
        }

        // 获取用户号
        var userid = -1;
        for (var k = 0; k < db_course.userdata.length; k++) {
          if (db_course.userdata[k].classid == item.classid) {
            userid = db_course.userdata[k].userid;
            break;
          }
        }
        // 用户不存在
        if (userid == -1) {
          return res.send({
            status: "error",
            errormessage: "user of " + item.classid + " doesn't exist"
          })
        }

        item.coursename = db_course.coursename;
        User.findOneById(userid, function(err, db_user) {
          if (err) {
            return res.send({
              status: "error",
              errormessage: err
            })
          }
          
          item.teachername = db_user.name;
          if (data.finished == false) {
            courselist.push(item);
          }
          ct++;
          if (ct == selection.selectiondata.length) {
            return res.send({
              status: "success",
              courselist: courselist
            })
          }
        })
      });
      next();
    }, function(err) {
      if (err) {
        console.log(err);
        return res.send({
          status: "error",
          errormessage: err
        });
      }
    })

  })
}

// 保存评课数据
exports.savadata = function(req, res) {
  var user = req.session.user;

  Selection.findByUserId(user.loginid, function(err, db_selection) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }
    // 获取用户选课记录
    var selection = db_selection;
    if (db_selection == null) {
      selection = new Selection();
      selection.userid = user.loginid;
    }

    if (selection.selectiondata == null)
      selection.selectiondata = new Array()

    // 获取选课数据
    var data = selection.selectiondata;

    // 获取前端查询课程号与课堂号
    var courseid = req.body.courseid;
    if (req.body.courseid == null)
      courseid = req.query.courseid;
    var classid = req.body.classid;
    if (req.body.classid == null)
      classid = req.query.classid;

    // 获取该课程的选课记录
    var index = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i].courseid == courseid 
        && data[i].classid == classid) {
        index = i;
      }
    }
    // 不存该课程的选课记录，创建
    if (index == -1) {
      index = data.length;
      selection.selectiondata[index] = {};
      selection.selectiondata[index].courseid = courseid;
      selection.selectiondata[index].classid = classid;
    }

    // 存入该课程问题号
    if (selection.selectiondata[index].problem == null)
      selection.selectiondata[index].problem = new Array();
    var problem = selection.selectiondata[index].problem;
    
    // 获取要保存的问题id，选项，花费时间，评论
    var problemid = req.body.problemid;
    if (problemid == null)
      problemid = req.query.problemid;
    var choiceid = req.body.choiceid;
    if (choiceid == null)
      choiceid = req.query.choiceid;
    var costtime = req.body.costtime;
    if (costtime == null)
      costtime = req.query.costtime;
    var comment = req.body.comment;
    if (comment == null)
      comment = req.query.comment;

    if (comment == null) { // 保存问题
      console.log("costtime " + costtime);
      
      // 获取该问题号所在数组下标
      var ind = -1;
      for (var i = 0; i < problem.length; i++) {
        if (problem[i].problemid == problemid) {
          ind = i;
        }
      }

      // 若为新添加数据
      if (ind == -1) {
        ind = problem.length;
        selection.selectiondata[index].problem[ind] = {};
      }

      // 存入选项数据
      selection.selectiondata[index].problem[ind].problemid = problemid;
      selection.selectiondata[index].problem[ind].choiceid = choiceid;
      selection.selectiondata[index].problem[ind].costtime = costtime;
      selection.selectiondata[index].finished = false;

      // 保存数据库
      selection.save(function(err, res_selection) {
        if (err) {
          res.send({
            status: "error",
            errormessage: err
          })
        }
      })

      return res.send({
        status: "success"
      })
    }
    else { // 保存评论
      selection.selectiondata[index].comment = comment;
      selection.selectiondata[index].finished = true;
      
      selection.save(function(err, _selection) {
        if (err) {
          res.send({
            status: "error",
            errormessage: err
          })
        }
      })
      return res.send({
        status: "success"
      })
    }
  })
}