var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.autologin = function(req, res) {
  //TODO:测试下，这里存在两个bug，登出时容易发生
  
  var login_user = req.session.user;
  if (login_user) {
    console.log(login_user.name + " has logined in this session!");
    return res.render('user', {
      status: "success",
      title: "User"
    });
  }
  //渲染了两次导致的侧边栏无法收回的错误
  console.log("go to index");
  return res.render('index', {
    status: "success",
    title: "Index"
  })
};