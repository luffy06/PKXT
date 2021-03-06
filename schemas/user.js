var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  // user ID
  loginid: {
    type: String,
    unique: true
  },
  // user name
  name: String,
  // user password
  pass: String,
  // user role: student, teacher, specialist, leader, supervisor, other
  role: {
    type: String,
    default: 'student'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    }, 
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

userSchema.pre('save', function(next) {
  var user = this;

  // set updating time
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  // use bcrypt to encrypt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err)
      return next(err);
    bcrypt.hash(user.pass, salt, function(err, hash) {
      if (err)
        return next(err);
      user.pass = hash;
      next();
    })
  })
});

// custom method
userSchema.methods = {
  // compare password
  comparePassword: function(pass, cb) {
    bcrypt.compare(pass, this.pass, function(err, isMatch) {
      if (err) 
        return cb(err);
      cb(null, isMatch);
    });
  },
  // update password
  updatePassword: function(pass, cb) {
    var user = this;

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err)
        return cb(err);
      bcrypt.hash(pass, salt, function(err, hash) {
        if (err)
          return cb(err);
        user.pass = hash;
        cb(null);
      });
    });
  }
}

// statics method
userSchema.statics = {
  // use user's role level to sort order by cmp
  fetch: function(cmp, cb) {
    return this
      .find({})
      .sort({"role": cmp})
      .exec(cb)
  },
  findOneById: function(loginid, cb) {
    return this
      .findOne({"loginid": loginid})
      .exec(cb)
  },
  // use user's name to find user
  findByName: function(name, cb) {
    return this
      .findOne({"name": name})
      .exec(cb)
  }
}

module.exports = userSchema;