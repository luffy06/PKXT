var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var Async = require('async');

inituserdata = function(res, callback) {
  var inituser = [];
  var func = [];

  var stu = new User();
  stu.loginid = "user";
  stu.name = "student";
  stu.pass = "123";
  stu.role = "student";
  var admin = new User();
  admin.loginid = "root";
  admin.name = "admin";
  admin.pass = "123";
  admin.role = "teacher";

  inituser.push(stu);
  inituser.push(admin);
  Async.each(inituser, function(user, next) {
    User.findOneById(admin.loginid, function(err, db_user) {
      return err;

      if (db_user == null) {
        user.save(function(err, res_user) {
          console.log("init user of " + user.loginid);
          if (err) {
            return res.send({
              status: "error",
              errormessage: err
            });
          }
        });
      }
    });
    next();
  }, function(err) {
    return err;
  })
}

exports.login = function(req, res) {
  var login_user = new User();
  login_user.loginid = req.body.name;
  login_user.pass = req.body.pass;  
  
  // 初始化数据
  inituserdata(function(err) {
    if (err) {
      return res.send({
        stauts: "error",
        errormessage: err
      })
    }
  });

  User.findOneById(login_user.loginid, function(err, db_user) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    if (db_user == null) {
      // user is not exist
      console.log(login_user.loginid + " doesn't exist!");
      return res.send({
        status: "error",
        errormessage: (login_user.loginid + " is not exist!")
      });
    }

    db_user.comparePassword(login_user.pass, function(err, isMatch) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        });
      }      

      if (!isMatch) {
        // password is wrong
        console.log(login_user.loginid + ": password is not match!");
        return res.send({
          status: "error",
          errormessage: "Password is wrong!"
        });
      }
      else {
        // password is right
        // add session
        req.session.user = db_user;
        return res.send({
          status: "success",
          name: db_user.name,
          role: db_user.role
        });
      }
    });
  });

};

exports.logout = function(req, res) {
  delete req.session.user;
  return res.send({
    status: "success"
  })
}