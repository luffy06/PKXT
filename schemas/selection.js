var mongoose = require('mongoose');

var selectionSchema = new mongoose.Schema({
  userid: Number,
  selectiondata: [{
    courseid: Number,
    classid: Number,
    finished: Boolean,
    problem: [{
      problemid: Number,
      choiceid: Number
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
});

// statics method
selectionSchema.statics = {
  fetchUnfinishedByUserId: function(id, cb) {
    return this
      .find({userid: id, selectiondata.finished: false})
      .exec(cb)
  },
  findByUserId: function(id, cb) {
    return this
      .find(userid: id)
      .exec(cb)
  }
}


module.exports = selectSchema;