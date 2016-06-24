var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.login = function(req, res) {
  var login_user = new User();
  login_user.name = req.body.name;
  login_user.pass = req.body.pass;

  console.log(login_user.name + " is logining!");

  User.findOne({name: 'root'}, function(err, user) {
    if (err) {
      console.log("Error Message in middlewares/user.js: " + err);
      return res.send({
        status: "error",
        ErrMes: err
      });      
    }
    if (!user) {
      user = new User();
      user.name = "root";
      user.pass = "root";
      user.role = "teacher";
      user.save(function(err, _user) {
        if (err) {
          console.log("Error Message in middlewares/user.js: " + err);
          return res.send({
            status: "error",
            ErrMes: err
          });          
        }
      });
    }
  });

  User.findOne({name: login_user.name}, function(err, user) {
    if (err) {
      console.log("Error Message in middlewares/user.js: " + err);
      return res.send({
        status: "error",
        ErrMes: err
      });
    }

    if (!user) {
      // user is not exist
      console.log("Error Message in middlewares/user.js: " + login_user.name + "is not exist!");
      return res.send({
        status: "error",
        ErrMes: (login_user.name + " is not exist!")
      });
    }
    
    user.comparePassword(login_user.pass, function(err, isMatch) {
      if (err) {
        console.log("Error Message in middlewares/user.js: " + err);
        return res.send({
          status: "error",
          ErrMes: err
        });
      }      

      if (!isMatch) {
        // password is wrong
        console.log(login_user.name + ": password is not match!");
        return res.send({
          status: "error",
          ErrMes: "Password is wrong!"
        });
      }
      else {
        // password is right
        // add session
        console.log("go to user.ejs");
        req.session.user = login_user;
        return res.redirect('/user/getuser');
      }
    });

  });
};