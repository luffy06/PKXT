var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var CourseSchema = require('../schemas/course');
var Course = mongoose.model('course', CourseSchema);
var Async = require('async');
var client = require('mysql').createConnection({
                host: 'localhost',
                user: "root",
                password: "",
                database: "jxpj"
              });

importstudent = function(client) {
  console.log('Ready to import student data');
  client.query("select distinct XH, XM from xsjbxxb where XH like '2013%';", function(err, data) {
    var students = [];
    console.log("There are " + data.length + " messages of student!");
    for (var i = 0; i < data.length && i < 500; i++) {
      var row = data[i];
      var stu = new User();
      stu.loginid = row['XH'];
      stu.name = row['XM'];
      stu.pass = row['XH'];
      stu.role = 'student';
      students.push(stu);
    }
    console.log("student's data in mongodb");

    Async.forEachOf(students, function(stu, key, next) {
      User.findOneById(stu.loginid, function(err, db_user) {
        if (err)
          return err;

        if (db_user == null) {
          // console.log("student " + key + " save " + stu.loginid + " " + stu.name);
          stu.save(function(err, res_user) {
            console.log("student " + key + " " + stu.loginid + " " + stu.name + " complete");
            if (err)
              return err;
          });
        }
      });

      next();
    }, function(err) {
      if (err) {
        console.log(err + " in student importing!");
        return err;
      }
    })
  })
}

importteacher = function(client) {
  console.log('Ready to import teacher data');
  client.query("select distinct JGH, XM from jsjbxxb;", function(err, data) {
    var teachers = [];
    console.log("There are " + data.length + " messages of teacher!");
    for (var i = 0; i < data.length && i < 500; i++) {
      var row = data[i];
      var tea = new User();
      tea.loginid = row['JGH'];
      tea.name = row['XM'];
      tea.pass = row['JGH'];
      tea.role = 'teacher';
      teachers.push(tea);
    }
    console.log("teacher's data in mongodb");

    Async.forEachOf(teachers, function(tea, key, next) {
      User.findOneById(tea.loginid, function(err, db_user) {
        if (err) 
          return err;

        if (db_user == null) {
          // console.log("teacher " + key + " save " + tea.loginid + " " + tea.name);
          tea.save(function(err, res_user) {
            console.log("teacher " + key + " " + tea.loginid + " " + tea.name + " complete");
            if (err) 
              return err;
          });
        }
      });

      next();
    }, function(err) {
      if (err) {
        console.log(err + " in teacher importing!");
        return err;
      }
    })
  })
}

importcourse = function(client) {
  console.log('Ready to import course data');
  client.query('select distinct kcsjb.KCH, kcsjb.KCMC, pksjb.JSGH from kcsjb, pksjb where kcsjb.KCH = pksjb.KCH;', function(err, data) {
    var courselist = [];
    console.log("There are " + data.length + " messages of course!");
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var ind = courselist.length - 1;
      if (i == 0 || row['KCH'] != courselist[ind].courseid) {
        var course = new Course();
        course.courseid = row['KCH'];
        course.coursename = row['KCMC'];
        var one = {};
        one.classid = 1;
        one.userid = row['JSGH'];
        course.userdata.push(one);
        courselist.push(course);
      }
      else {
        var j = courselist[ind].userdata.length - 1;
        var one = {};
        one.classid = j + 1;
        one.userid = row['JSGH'];
        courselist[ind].userdata.push(one);
      }
    }
    console.log("course's data in mongodb");

    Async.forEachOf(courselist, function(course, key, next) {
      Course.findByCourseId(course.courseid, function(err, db_course) {
        if (err)
          return err;

        if (db_course == null) {
          // console.log("course " + key + " saving: " + course.courseid + " " + course.coursename);
          course.save(function(err, rr) {
            console.log("course " + key + " " + course.courseid + " " + course.coursename + " complete");
            if (err)
              return err;
          })
        }
      })

      next();
    }, function(err) {
      if (err) {
        console.log(err + " in course importing!");
        return err;
      }
    })

  })
}

exports.initdata = function(req, res) {
  var user = req.session.user;
  delete req.session.user;
  if (user.loginid != "root") { 
    return res.send({
      status: "success"
    })
  }

  console.log("Initialize data");
  client.connect();
  console.log('Connected to MySQL');

  client.query('use jxpj', function(err, result) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // Async.parallel([
    //   function() {
    //     importstudent(client)
    //   },
    //   function() {
    //     importteacher(client)
    //   },
    //   function() {
    //     importcourse(client)
    //   }], function(err, results) {
    //   if(err) {
    //     return res.send({
    //       status: "error",
    //       errormessage: err
    //     })
    //   }
    // })

    console.log("Completed!");
    return res.send({
      status: "success"
    })
  })

};