var mongoose = require('mongoose');

var selectSchema = new mongoose.Schema({
  userid: Number,
  courseid: Number,
  problem: [{
    problemid: Number,
    choiceid: Number
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

selectSchema.pre('save', function(next) {
  var select = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
});

module.exports = selectSchema;