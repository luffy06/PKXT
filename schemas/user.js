var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userScema = new mongoose.Schema({
  // 用户ID
  userid: {
    type: String,
    unique: true
  },
  // 用户名
  username: String,
  // 用户性别
  usersex: Number,
  // 用户密码
  password: String,
  // 用户角色: student, teacher, specialist, leader, supervisor, other
  role: {
    type: String,
    default: 'student'
  },
  // 专业ID
  majorid: Number,
  // 年级
  grade: Number
});

userSchema.pre('save', function(next) {
  var user = this;

  // 设置更新时间
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  // 利用bcrypt进行加密
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err)
      return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err)
        return next(err);
      user.password = hash;
      next();
    })
  })
});

// 自定义方法
userSchema.methods = {
  // 比较密码
  comparePassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) 
        return cb(err);
      cb(null, isMatch);
    });
  },
  // 更新密码
  updatepsw: function(password, cb) {
    var user = this;

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err)
        return cb(err);
      bcrypt.hash(password, salt, function(err, hash) {
        if (err)
          return cb(err);
        user.password = hash;
        cb(null);
      });
    })
  }
}

// 静态方法
userSchema.statics = {
  // 根据cmp来获取更新用户并排序
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({'role': cmp})
      .exec(cb)
  },
  // 依据用户名查找用户
  findByName: function(name, cb) {
    return this
      .findOne({name: name})
      .exec(cb)
  }
}

module.exports = userSchema;