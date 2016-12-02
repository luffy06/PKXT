var mongoose = require('mongoose');
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var Async = require('async');

// 获取未完成的评课记录
exports.getunfinished = function(req, res) {
  // 获取当前登录用户
  var user = req.session.user;

  // 查询该用户选课记录
  Selection.findByUserId(user.loginid, function(err, selection) {
    // 选课记录为空
    var courselist = new Array();
    if (selection == null || selection.selectiondata == null) {
      return res.send({
        status: "success",
        courselist: courselist
      });
    }
    
    var ct = 0;

    // 异步获取未完成的选课的详细课程信息
    Async.each(selection.selectiondata, function(data, next) {
      var item = {};
      item.courseid = data.courseid;
      item.classid = data.classid;
      // 查询某课程的详细课程信息
      Course.findByCourseId(item.courseid, function(err, db_course) {
        if (err) {
          return err;
        }

        // 课程不存在
        if (db_course == null) {
          return new Error("课程号 " + item.courseid + " 不存在");
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

        // 设置课程名
        item.coursename = db_course.coursename;

        // 查询教师姓名
        User.findOneById(userid, function(err, db_user) {
          if (err) {
            return err;
          }
          
          // 设置教师名
          item.teachername = db_user.name;
          if (data.finished == false) {
            courselist.push(item);
          }

          ct++;
          // 全部完成，返回
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
  // 获取当前登录用户
  var user = req.session.user;

  // 查询该用户的选课记录
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