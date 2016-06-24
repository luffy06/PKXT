var express = require('express');
var user = require('../middlewares/user');
var User = express.Router();


User.post('/login', user.login)
      .get('/getuser', function(req, res) {
        res.render('user', {
          status: "success",
          title: "User"
        })
      })

module.exports = User;
