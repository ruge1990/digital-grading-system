const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  classname: {type: String, unique: true, required: true, index: true},
  subjects: [{
    subjectID: {type: mongoose.Types.ObjectId, required: true},
    subjectname: {type: String, required: true},
    teacherID: {type: mongoose.Types.ObjectId, required: true}
  }],
  pupils: [{
    pupilID: {type: mongoose.Types.ObjectId, required: true}
  }]
});

module.exports = mongoose.model("Class", ClassSchema);