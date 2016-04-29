var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  courseid: Number,
  coursename: String,
  courseplace: String, 
  coursetime: {
    weekstart: Number,
    weekend: Number,
    start: Number,
    end: Number
  },
  problem: [{
    problemid: Number,
    descript: String,
    choice: [String]
  }]
});

module.exports = courseSchema;