var mongoose = require('mongoose');
var UserSchema = require('../schema/user');
var User = mongoose.model('user', UserSchema);

exports.login = function(req, res) {
  var login_user = req.body.user;
  var username = login_user.name;
  var userpass = login_user.pass;

  console.log(username + "is logining!");

  User.findOne({name: username}, function(err, user) {
    if (err) {
      console.log("Error Message in middlewares/user.js: " + err);
      return res.render('error', {
        ErrMes: err
      });
    }

    if (!user) {
      // user is not exist
      console.log("Error Message in middlewares/user.js: " + username + "is not exist!");
      return res.redner('error', {
        ErrMes: (username + "is not exist!")
      });
    }
    
    user.comparePassword(userpass, function(err, isMatch) {
      if (err) {
        console.log("Error Message in middlewares/user.js: " + err);
        return res.render('error', {
          ErrMes: err
        });
      }      

      if (!isMatch) {
        // password is wrong
        console.log(username + ": password is not match!");
        return res.render('error', {
          ErrMes: "Password is wrong!"
        });
      }
      else {
        // password is right
        // add session
        req.session.user = login_user;
        res.redirect('/');
      }
    });

  });
};