const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  subjectname: {type: String, required: true},
  teacherID: {type: mongoose.Types.ObjectId, required: true},
  tests: [{
    testID: {type: mongoose.Types.ObjectId}
  }],
  archived: {type: Boolean, default: false}
});

module.exports = mongoose.model("Subject", SubjectSchema);