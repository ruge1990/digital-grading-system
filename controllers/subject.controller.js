const classModel = require("../models/class.model");
const subjectModel = require("../models/subject.model");
const utils = require("../utils");
// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');


exports.create_subject = async (req, res) => {
  if (req.user.role != "admin") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  var subject = new subjectModel(req.body);

  subject.save((error) => {
    if(error) {
      console.log(error.message);
      return res.json({error: true, message: error.message});
    }
    console.log("subject( " + subject._id + " ) has been created");

    const s = {
      subjectID: subject._id,
      subjectname: subject.subjectname,
      teacherID: subject.teacherID
    }

    classModel.findByIdAndUpdate(req.body.classID, { $push: {subjects: s}},
      {new: true}, (error, _class) => {
      if (error) {
          console.log(error.message);
          return res.json({ error: true, message: error.message });
      }
      console.log("class( " + req.body.classID + " ) has been updated");
      return res.json({
        success: true,
        message: "Subject created, and class updated",
        subject: subject,
        class: _class
      });
    });
  })
}

exports.list_subject = (req, res) => {
  if (req.user.role != "admin" && req.user.role != "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }

  if( req.headers.teacherid) {
    subjectModel.find({"teacherID": req.headers.teacherid}, null, {sort:{subjectname:1}}, (error, subject) => {
      if (error) {
        res.send({ error: true, message: error.message });
      }
      console.log("subjects of teacher( " + req.headers.teacherid + " ) has been listed");
      res.send(subject);
    })
  } else {
    subjectModel.find({}, null, {sort:{subjectname:1}}, (error, subject) => {
      if (error) {
        res.send({ error: true, message: error.message });
      }
      console.log("subjects have been listed");
      res.send(subject);
    })
  }
}

exports.get_subject = (req, res) => {
  if (req.user.role !== "pupil" && req.user.role !== "admin") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  subjectModel.findById(req.params.id, (error, subject) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      //console.log(test);
      res.send(subject);
  })
}

exports.update_subject = (req, res) => {
  if (req.user.role != "admin") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  subjectModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true}, (error, subject) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }

    console.log("subject( " + subject._id + " ) has been updated");

    const s = {
      subjectname: subject.subjectname,
      teacherID: subject.teacherID
    }

    classModel.findOneAndUpdate({
      "_id": req.body.classID,
      "subjects.subjectID": subject._id
    }, {
      $set: {
        "subjects.$.subjectname": subject.subjectname,
        "subjects.$.teacherID": subject.teacherID
    }}, {new: true, upsert: true}, (error, _class) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("class( " + req.body.classID + " ) has been updated");
    return res.json({
      success: true,
      message: "Subject created, and class updated",
      subject: subject,
      class: _class
      });
    });
  })
}

exports.archive_subject = (req, res) => {
  if (req.user.role != "admin") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  subjectModel.findByIdAndUpdate(req.params.id, { $set: {"archived": true}}, { new: true}, (error, subject) => {
    if (error) {
        console.log(error.message);
        return res.json({ error: true, message: error.message });
    }
    console.log("subject( " + subject._id + " ) has been archived");

    return res.json({
        success: true,
        message: "Subject archived"
    });
  })
}

exports.delete_subject = (req, res) => {
  if (req.user.role != "admin") {
      return res.status(401).json({
        success: false,
        message: 'Invalid user to access it.'
      });
  }

  subjectModel.findByIdAndRemove(req.params.id, (error) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }
    console.log("subject( " + req.params.id + " ) has been deleted");
    
    classModel.findOneAndUpdate({
      "_id": req.headers.classid,
      "subjects.subjectID": req.params.id
    }, {
      $pull: {
        "subjects": {"subjectID": req.params.id}
    }}, { safe: true, multi:true, new: true}, (error, _class) => {
    if (error) {
      console.log(error.message);
      return res.json({ error: true, message: error.message });
    }

    console.log("class( " + _class._id + " ) has been updated");
    return res.json({
      success: true,
      message: "Subject deleted, and class updated",
      class: _class
      });
    });
  })
}
