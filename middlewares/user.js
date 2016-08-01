var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.login = function(req, res) {
  var login_user = new User();
  login_user.id = req.body.id;
  login_user.pass = req.body.pass;

  console.log(login_user.id + " is logining!");
  login_user.getHashedUserId(function(err) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      })
    }
    User.findOne({id: login_user.id}, function(err, db_user) {
      if (err) {
        return res.send({
          status: "error",
          errormessage: err
        });
      }

      if (!user) {
        // user is not exist
        console.log("in middlewares/user.js: " + login_user.id + "is not exist!");
        return res.send({
          status: "error",
          errormessage: (login_user.id + " is not exist!")
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
          console.log("in middlewares/user.js: " + login_user.id + ": password is not match!");
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
            title: "User"
          });
        }
      });
    });
  });  
};