var express = require('express');
var user = require('../middlewares/user');
var router = express.Router();


router.get('/login', user.login)
      .get('/logout', user.logout)


module.exports = router;
