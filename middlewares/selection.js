var mongoose = require('mongoose');
var SelectionSchema = require('../schemas/selection');
var Selection = mongoose.model('selection', SelectionSchema);

exports.getunfinished = function(req, res) {
  var user = req.session.user;
  Selection.fetchUnfinishedByUserId(user.id, function(err, selection) {
    var data = selection.selectiondata
    var courselist = new Array();
    for (var i = 0, j = 0; i < data.size(); i++) {
      if (data[i].finished == false) {
        var course = {};
        course.courseid = data[i].courseid;
        course.classid = data[i].classid;
        Course.findByCourseId(course.courseid, function(err, db_course) {
          if (err) {
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
      title: "UnfinishedCourseList"
      courselist: courselist
    })
  })
}

exports.savadata = function(req, res) {
  var user = req.session.user;
  Selection.findByUserId(user.id, function(err, db_selection) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })

      var selection = db_selection;
      if (!db_selection) {
        selection = new Selection();
        selection.userid = user.id;
      }

      var data = selection.selectiondata;
      var courseid = req.query.courseid;
      var classid = req.query.classid;
      // var finished = 
      
      var index = -1;
      for (var i = 0; i < data.size(); i++) {
        if (data[i].courseid == courseid 
          && data[i].classid == classid) {
          index = i;
        }
      }
      if (index == -1) {
        index = data.size();
        selection.selectiondata[index] = {};
        selection.selectiondata[index].courseid = courseid;
        selection.selectiondata[index].classid = classid;
      }

      var problem = selection.selectiondata.problem;
      var problemid = req.body.problemid;
      var choiceid = req.body.choiceid;
      var ind = -1;

      for (var i = 0; i < problem.size(); i++) {
        if (problem[i].problemid == problemid) {
          ind = i;
        }
      }

      if (ind == -1) {
        ind = problem.size();
      }
      selection.selectiondata[index].problem[ind].problemid = problemid;
      selection.selectiondata[index].problem[ind].choiceid = choiceid;

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