var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.autologin = function(req, res) {
  //TODO:测试下，这里存在两个bug，登出时容易发生
  console.log("in autologin");
  var login_user = req.session.user;
  if (login_user) {
    console.log(login_user.name + " has logined in this session!");
    return res.render('user', {
      status: "success",
      title: "User"
    })
  }
  //渲染了两次导致的侧边栏无法收回的错误
  console.log("no user is logined!")
  // var new_mac_address = req.body.mac_address;

  // User.findByMAC(new_mac_address, function(err, user) {
  //   if (err) {
  //     console.log("Error Message in middlewares/index.js: " + err);
  //     return res.render('error', {
  //       ErrMes: err
  //     });
  //   }
  //   if (user) {
  //     // this user has logined before this session
  //     req.session.user = user;
  //     res.render('index', {
  //       title: 'Index'
  //     })
  //   }
  // })
   res.render('index', {
    status: "success",
    title: "Index"
  })
};