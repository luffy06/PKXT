var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
  problemid: Number,
  userid: Number,
  courseid: Number,
  description: String,
  choice: [{
    choiceid: Number,
    choicedesc: String
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


problemSchema.pre('save', function(next) {
  var problem = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
});

module.exports = problemSchema;