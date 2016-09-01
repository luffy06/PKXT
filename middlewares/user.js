var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('user', UserSchema);

exports.login = function(req, res) {
  var login_user = new User();
  login_user.loginid = req.body.name;
  login_user.pass = req.body.pass;

  var user = new User();
  user.loginid = "user";
  user.name = "student";
  user.pass = "123";
  user.role = "student";
  User.findOneById(user.loginid, function(err, db_user1) {
    if (err) {
      return res.send({
        status: "error",
        errormessage: err
      });
    }

    if (db_user1 == null) {
      user.save(function(err, res_user1) {
        if (err) {
          console.log(err);
          return res.send({
            status: "error",
            errormessage: err
          });
        }

        var admin = new User();
        admin.loginid = "root";
        admin.name = "admin";
        admin.pass = "123";
        admin.role = "teacher";
        User.findOneById(admin.loginid, function(err, db_user2) {
          if (err) {
            return res.send({
              status: "error",
              errormessage: err
            });
          }

          if (db_user2 == null) {
            admin.save(function(err, res_user2) {
              console.log(err);
              if (err) {
                return res.send({
                  status: "error",
                  errormessage: err
                });
              }

            });
          }
        });

      });
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
    console.log(login_user.loginid + " exist!");

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
        console.log("success");
        req.session.user = db_user;
        console.log(db_user.role);
        return res.send({
          status: "success",
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