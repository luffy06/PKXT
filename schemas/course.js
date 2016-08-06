var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  courseid: Number,
  coursename: String,
  userdata: [{
    classid: Number,
    userid: Number,
    problem: [{
      problemid: Number,
      description: String,
      choice: [{
        choiceid: Number,
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
      .find({courseid: id})
      .exec(cb)
  }
}

module.exports = courseSchema;