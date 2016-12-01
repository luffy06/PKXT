var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);
var Async = require('async');

// 初始化默认数据
inituserdata = function(callback) {
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

  // 异步导入数据
  Async.each(inituser, function(user, next) {
    User.findOneById(user.loginid, function(err, db_user) {
      if (err) {
        return callback(err);
      }

      if (db_user == null) {
        user.save(function(err, res_user) {
          if (err) {
            return callback(err);
          }
        });
      }
    });
    next();
  }, function(err) {
    if (err) {
      return callback(err);
    }
  })
}

// 用户登录
exports.login = function(req, res) {
  // 获取输入用户名及密码
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

  // 查找该用户是否存在
  User.findOneById(login_user.loginid, function(err, db_user) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    // 用户不存在
    if (db_user == null) {
      console.log("用户 " + login_user.loginid + " 不存在");
      return res.send({
        status: "error",
        errormessage: ("用户 " + login_user.loginid + " 不存在")
      });
    }

    // 用户存在，比较密码
    db_user.comparePassword(login_user.pass, function(err, isMatch) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        });
      }      

      if (!isMatch) { // 密码不匹配
        console.log("用户 " + login_user.loginid + " 密码错误");
        return res.send({
          status: "error",
          errormessage: "密码错误"
        });
      }
      else { // 密码匹配
        // 添加session
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

// 用户登出
exports.logout = function(req, res) {
  delete req.session.user;
  return res.send({
    status: "success"
  })
}