var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  courseid: String,
  coursename: String,
  userdata: [{
    classid: String,
    userid: String,
    problem: [{
      problemid: String,
      description: String,
      choice: [{
        choiceid: String,
        choicedesc: String
      }]
    }]
  }],
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

courseSchema.pre('save', function(next) {
  var course = this;

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  next();
});

// custom method
// courseSchema.methods = {
// }

// statics method
courseSchema.statics = {
  fetchByUserId: function(id, cb) {
    return this
      .find({"userdata.userid": id})
      .exec(cb)
  },
  findByCourseId: function(id, cb) {
    return this
      .findOne({courseid: id})
      .exec(cb)
  }
}

module.exports = courseSchema;