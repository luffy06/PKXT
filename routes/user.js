var express = require('express');
var user = require('../middlewares/user');
var router = express.Router();


router.post('/login', user.login);//修改为post，get方法不安全

module.exports = router;
