var mongoose = require('mongoose');

var selectionSchema = new mongoose.Schema({
  userid: String,
  selectiondata: [{
    courseid: String,
    classid: String,
    finished: Boolean,
    problem: [{
      problemid: String,
      choiceid: String,
      timecost: Number
    }],
    comment: String
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
  findByUserId: function(id, cb) {
    return this
      .findOne({"userid": id})
      .exec(cb)
  },
  findByUserIdAndCourseId: function(userid, courseid, cb) {
    return this
      .findOne({"userid": userid, "selectiondata.courseid": courseid}, 
        {"selectiondata": 1, _id: 0})
      .exec(cb)
  },
  findByCourseIdAndClassId: function(courseid, classid, cb) {
    return this
      .find({"selectiondata.courseid": courseid, "selectiondata.classid": classid, 
        "selectiondata.finished": true}, {"selectiondata": 1, _id: 0})
      .exec(cb)
  }
}


module.exports = selectionSchema;