const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  testname: {type: String, required: true},
  date: {type: Date, required: true},
  grades: [{
    pupilID: {type: mongoose.Types.ObjectId, required: true},
    grade: {type: Number, required: true}
  }]
});

module.exports = mongoose.model("Test", TestSchema);