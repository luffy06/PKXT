var mongoose = require('mongoose');
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);

exports.getunfinished = function(req, res) {
  var user = req.session.user;

  Selection.fetchUnfinishedByUserId(user.loginid, function(err, selection) {
    var courselist = new Array();
    if (selection == null || selection.selectiondata == null) {
      return res.send({
        status: "success",
        title: "UnfinishedCourseList",
        courselist: courselist
      });
    }
    var data = selection.selectiondata;
    for (var i = 0, j = 0; i < data.length; i++) {
      if (data[i].finished == false) {
        var course = {};
        course.courseid = data[i].courseid;
        course.classid = data[i].classid;
        Course.findByCourseId(course.courseid, function(err, db_course) {
          if (err) {
            console.log(err);
            return res.send({
              status: "error",
              errormessage: err
            })
          }
          course.coursename = db_course.coursename;
        })
        courselist[j] = course;
        j++;
      }
    }
    return res.send({
      status: "success",
      title: "UnfinishedCourseList",
      courselist: courselist
    })
  })
}

exports.savadata = function(req, res) {
  var user = req.session.user;

  Selection.findByUserId(user.loginid, function(err, db_selection) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }
    var selection = db_selection;
    if (db_selection == null) {
      selection = new Selection();
      selection.userid = user.loginid;
    }

    if (selection.selectiondata == null)
      selection.selectiondata = new Array()

    var data = selection.selectiondata;
    var courseid = req.body.courseid;
    if (req.body.courseid == null)
      courseid = req.query.courseid;
    var classid = req.body.classid;
    if (req.body.classid == null)
      classid = req.query.classid;

    var index = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i].courseid == courseid 
        && data[i].classid == classid) {
        index = i;
      }
    }
    if (index == -1) {
      index = data.length;
      selection.selectiondata[index] = {};
      selection.selectiondata[index].courseid = courseid;
      selection.selectiondata[index].classid = classid;
    }

    if (selection.selectiondata[index].problem == null)
      selection.selectiondata[index].problem = new Array();
    var problem = selection.selectiondata[index].problem;
    
    var problemid = req.body.problemid;
    if (req.body.problemid == null)
      problemid = req.query.problemid;
    var choiceid = req.body.choiceid;
    if (req.body.choiceid == null)
      choiceid = req.query.choiceid;

    var ind = -1;
    var finished = false;

    for (var i = 0; i < problem.length; i++) {
      if (problem[i].problemid == problemid) {
        ind = i;
      }
    }

    if (ind == -1) {
      ind = problem.length;
      selection.selectiondata[index].problem[ind] = {};
    }

    Course.findByCourseId(courseid, function(err, db_course) {
      if (err) {
        return res.send({
          status: "error", 
          errormessage: err
        })
      }

      if (db_course == null) {
        return res.send({
          status: "error", 
          errormessage: courseid + " doesn't exist!"
        })
      }

      var len = -1;
      for (var i = 0; i < db_course.userdata.length; i++) {
        if (db_course.userdata[i].classid == classid) {
          len = db_course.userdata[i].problem.length;
          break;
        }
      }

      if (len == -1) {
        console.log(classid + " doesn't exist!");
        return res.send({
          status: "error",
          errormessage: classid + " doesn't exist!"
        })
      }

      if (len == problem.length)
        finished = true;

      selection.selectiondata[index].problem[ind].problemid = problemid;
      selection.selectiondata[index].problem[ind].choiceid = choiceid;
      selection.selectiondata[index].finished = finished;

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
    })
  })
}