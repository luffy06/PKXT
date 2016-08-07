var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.login = function(req, res) {
  var login_user = new User();
  login_user.loginid = req.body.name;
  login_user.pass = req.body.pass;

  // for test
  // req.session.user = login_user;
  // return res.send({
  //   status: "success",
  //   title: "User",
  //   role: "student"
  // })

  
  User.findOneById({loginid: login_user.loginid}, function(err, db_user) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    if (!db_user) {
      // user is not exist
      console.log("in middlewares/user.js: " + login_user.loginid + "is not exist!");
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
        console.log("in middlewares/user.js: " + login_user.loginid + ": password is not match!");
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
          title: "User",
          role: db_user.role
        });
      }
    });
  });
};