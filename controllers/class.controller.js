const classModel = require("../models/class.model");
const utils = require("../utils");
// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');


exports.create_class = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    var _class = new classModel(req.body);
    
    _class.save((error) => {
      if(error) {
        console.log(error.message);
        return res.json({error: true, message: error.message});
      }
      console.log("class( " + _class._id + " ) has been created");
      return res.status(201).json({
          success: true,
          message: "Class created",
          class: _class
      });
    })

}

exports.list_class = (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    classModel.find({}, null, {sort:{classname:1}}, (error, _class) => {
        if (error) {
            res.send({ error: true, message: error.message });
        }
        res.send(_class);
    })
}

exports.update_class = (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    classModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true}, (error, _class) => {
        if (error) {
            console.log(error.message);
            return res.json({ error: true, message: error.message });
        }
        console.log("class( " + _class._id + " ) has been updated");
        return res.json({
            success: true,
            message: "Class updated",
            class: _class
        });
    })
}

exports.delete_class = (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    classModel.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            console.log(error.message);
            return res.json({ error: true, message: error.message });
        }
        console.log("class( " + req.params.id + " ) has been deleted");
        return res.json({
            success: true,
            message: "Class deleted",
        });
    })
}

exports.assign_pupil = (req, res) => {
  if (req.user.role != "admin") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  console.log(JSON.stringify(req.body));
  if( req.body.assign == 'true') {
    classModel.findByIdAndUpdate(req.params.id, { $push: {pupils: {pupilID: req.body.pupilID }}}, { new: true}, (error, _class) => {
      if (error) {
          console.log(error.message);
          return res.json({ error: true, message: error.message });
      }
      console.log("pupil( " + req.body.pupilID + " ) has been assigned");
      return res.json({
          success: true,
          message: "Class updated",
          class: _class
      });
    })
  } else {
    classModel.findOneAndUpdate({
      "_id": req.params.id,
      "pupils.pupilID": req.body.pupilID
    }, {
      $pull: {
        "pupils": {"pupilID": req.body.pupilID}
    }}, { safe: true, multi:true, new: true}, (error, _class) => {
      if (error) {
        console.log(error.message);
        return res.json({ error: true, message: error.message });
      }
      console.log("pupil( " + req.body.pupilID + " ) has been deassigned");
      return res.json({
          success: true,
          message: "Class updated",
          class: _class
      });
    }) 
  }
}

exports.contain_pupil = (req, res) => {
  if (req.user.role != "pupil") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  classModel.findOne({"pupils.pupilID" : req.body.pupilID}, null, (error, _class) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      res.send(_class);
  })
}