const classModel = require("../models/class.model");
const subjectModel = require("../models/subject.model");
const testModel = require("../models/test.model");
const utils = require("../utils");
// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');


exports.create_test = async (req, res) => {
    if (req.user.role != "teacher") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    var test = new testModel(req.body);
    //console.log(JSON.stringify(test));

    test.save((error) => {
      if(error) {
        console.log(error.message);
        return res.json({error: true, message: error.message});
      }
      console.log("test( " + test._id + " ) has been created");
    })

    subjectModel.findByIdAndUpdate(req.body.subjectID, { $push: {tests: {testID: test._id}}}, {new: true}, (error, subject) => {
      if (error) {
          console.log(error.message);
          return res.json({ error: true, message: error.message });
      }
      console.log("subject( " + req.body.subjectID + " ) has been updated");
      return res.json({
          success: true,
          message: "Test created, and subject updated",
          test: test,
          subject: subject
        });
    });
}

exports.list_test = (req, res) => {
    if (req.user.role != "teacher") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    subjectModel.findOne({_id: req.body.subjectID}, "tests", {}, (error, test) => {
        if (error) {
            res.send({ error: true, message: error.message });
        }
        console.log("tests of subject( " + req.body.subjectID + " ) has been listed");
        res.send(test);
    })
}

exports.update_test = (req, res) => {
  if (req.user.role != "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  testModel.findByIdAndUpdate(req.params.id, {
    "testname": req.body.testname,
    "date": req.body.date
    }, { new: true}, (error, test) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("test( " + test._id + " ) has been updated");
    return res.json({
      success: true,
      message: "Test updated",
      test: test
    });
  })
}

exports.delete_test = (req, res) => {
  if (req.user.role != "teacher") {
      return res.status(401).json({
        success: false,
        message: 'Invalid user to access it.'
      });
  }
  testModel.findByIdAndRemove(req.params.id, (error) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("test( " + req.params.id + " ) has been deleted");

    subjectModel.findOneAndUpdate({
      "_id": req.headers.subjectid,
      "tests.testID": req.params.id
    }, {
      $pull: {
        "tests": {"testID": req.params.id}
    }}, {safe: true, multi:true, new: true}, (error, subject) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("subject( " + req.body.subjectID + " ) has been updated");
    //console.log(JSON.stringify(subject))
    return res.json({
      success: true,
      message: "Test deleted, and subject updated",
      subject: subject
      });
    });
  })
}

exports.get_test = (req, res) => {
  if (req.user.role !== "teacher" && req.user.role!== "pupil") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  testModel.findById(req.params.id, (error, test) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      //console.log(test);
      res.send(test);
  })
}

exports.create_grade = (req, res) => {
  if (req.user.role != "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  console.log(req.body.pupilID);
  if(!req.body.grades) {
    testModel.findOneAndUpdate({"_id": req.params.id }, {
      $push: {"grades": {"grade": req.body.grade, "pupilID": req.body.pupilID}}}, {new: true}, (error, test) => {
      if (error) {
        console.log(error.message);
        return res.json({ error: true, message: error.message });
      }
      console.log("test( " + req.params.id + " ) has been updated");
      return res.json({
        success: true,
        message: "Test updated",
        test: test
      });
    })
  }
}

exports.update_grade = (req, res) => {
  if (req.user.role != "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  console.log(req.body.pupilID);
  if(!req.body.grades) {
    testModel.findOneAndUpdate({"_id": req.params.id, "grades.pupilID": req.body.pupilID}, {
      $set: {"grades.$.grade": req.body.grade}}, {new: true}, (error, test) => {
      if (error) {
        console.log(error.message);
        return res.json({ error: true, message: error.message });
      }
      console.log("test( " + req.params.id + " ) has been updated");
      return res.json({
        success: true,
        message: "Test updated",
        test: test
      });
    })
  }
}

exports.delete_grade = (req, res) => {
  if (req.user.role != "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  console.log(req.headers.pupilid);

  testModel.findOneAndUpdate({"_id": req.params.id, "grades.pupilID": req.headers.pupilid}, {
    $pull: {"grades": {"pupilID": req.headers.pupilid}}}, {new: true}, (error, test) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("test( " + req.params.id + " ) has been updated");
    return res.json({
      success: true,
      message: "Test updated",
      test: test
    });
  })

}

exports.get_grade = (req, res) => {
  if (req.user.role != "teacher" && req.user.role != "pupil") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  testModel.findOne({_id: req.params.id, "grades.pupilID": req.params.pupilID}, "grades.$", (error, grade) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      console.log("grade of pupil( " + req.params.pupilID + " ) has been listed");
      res.send(grade);
  })
}
