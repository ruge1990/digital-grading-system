const userModel = require("../models/user.model");
const classModel = require("../models/class.model");
const utils = require("../utils");

// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');


// validate the user credentials
exports.login = (req, res) => {
    const name = req.body.username;
    const pwd = req.body.password;

    // return 400 status if username/password is not exist
    if (!name || !pwd) {
        return res.status(400).json({
            error: true,
            message: "Username or Password is required."
        });
    }

    // return 401 status if the credential is not match.
    userModel.findOne({ username: name, password: pwd }, (error, user) => {
        if (error || !user) {
            return res.status(401).json({
                error: true,
                message: "Username or Password is wrong."
            });
        }
        
        console.log("user( " + user._id + " ) just login");

        // generate token
        const token = utils.generateToken(user);
        // get basic user details
        const userObj = utils.getCleanUser(user);
        // return the token along with user details
        return res.json({ user: userObj, token });
    });
}

// verify the token and return it if it's valid
exports.verify_token = (req, res) => {
    // check header or url parameters or post parameters for token
    var token = req.query.token;
    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }

    // check token that was passed by decoding token using secret
    jwt.verify(token, "ruge1990", function (err, user) {
        if (err) return res.status(401).json({
            error: true,
            message: "Invalid token."
        });

        // return 401 status if the username does not match.
        userModel.findOne({ _id: user.userID}, (error, userData) => {
            if (error || !userData || user.userID != userData._id) {
                return res.status(401).json({
                    error: true,
                    message: "Username or Password is wrong."
                });
            }
            
            console.log("user( " + userData._id + " ) refresh the page");
            
            // get basic user details
            var userObj = utils.getCleanUser(userData);
            return res.json({ user: userObj, token });
        });
    });
}

exports.create_user = async (req, res) => {
    if (req.user.role != "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    var user = new userModel(req.body);
    
    user.save((error) => {
      if(error) {
        console.log(error.message);
        return res.json({error: true, message: error.message});
      }

      console.log("user( " + user._id + " ) has been created");
      
      var userObj = utils.getCleanUser(user);
      return res.status(201).json({
          success: true,
          message: "User created",
          user: userObj
      });
    })

}

exports.list_user = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    return res.status(401).json({
      success: false,
      message: 'Invalid user to access it.'
    });
  }
  if( req.headers.role ){
    userModel.find({role: req.headers.role}, null, {sort:{username:1}}, (error, user) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      res.send(user);
    })
  } else if(req.headers.subjectid) {
    classModel.findOne({"subjects.subjectID": req.headers.subjectid}, "pupils.pupilID", (error, _class) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      //console.log(_class);
      res.send(_class);
    })
  } else {
    userModel.find({}, null, {sort:{role:1}}, (error, user) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      res.send(user);
  })
  }
}

exports.update_user = (req, res) => {
    if (req.user.role !== "admin"  && req.user.userID != req.params.id) {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    userModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true}, (error, user) => {
        if (error) {
            console.log(error.message);
            return res.json({ error: true, message: error.message });
        }

        console.log("user( " + user._id + " ) has been updated");

        var userObj = utils.getCleanUser(user);
        return res.json({
            success: true,
            message: "User updated",
            user: userObj
        });
    })
}

exports.delete_user = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            success: false,
            message: 'Invalid user to access it.'
        });
    }
    userModel.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            console.log(error.message);
            return res.json({ error: true, message: error.message });
        }

        console.log("user( " + req.params.id + " ) has been deleted");

        return res.json({
            success: true,
            message: "User deleted",
        });
    })
}

exports.get_user = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "teacher") {
      return res.status(401).json({
          success: false,
          message: 'Invalid user to access it.'
      });
  }
  userModel.findById(req.params.id, (error, user) => {
      if (error) {
          res.send({ error: true, message: error.message });
      }
      res.send(user);
  })
}
