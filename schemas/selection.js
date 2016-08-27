var mongoose = require('mongoose');

var selectionSchema = new mongoose.Schema({
  userid: String,
  selectiondata: [{
    courseid: String,
    classid: String,
    finished: Boolean,
    problem: [{
      problemid: String,
      choiceid: String
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

selectionSchema.pre('save', function(next) {
  var selection = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  next()
});

// statics method
selectionSchema.statics = {
  fetchUnfinishedByUserId: function(id, cb) {
    return this
      .findOne({"userid": id})
      .exec(cb)
  },
  findByUserId: function(id, cb) {
    return this
      .findOne({"userid": id})
      .exec(cb)
  },
  checkFinishedByUserIdAndCourseId: function(userid, courseid, classid, cb) {
    return this
      .findOne({"userid": userid, "selectiondata.courseid": courseid, 
      "selectiondata.classid": classid}, {"selectiondata.finished":1, _id:0})
      .exec(cb)
  }
}


module.exports = selectionSchema;