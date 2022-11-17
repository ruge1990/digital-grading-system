// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');

// generate token and return it
function generateToken(user) {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!user) return null;

  var u = {
    userID: user._id,
    role: user.role
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 // expires in 1 hours
  });
}

// return basic user details
function getCleanUser(user) {
  if (!user) return null;

  return {
    userID: user._id,
    username: user.username,
    password: user.password,
    forename: user.forename,
    surname: user.surname,
    role: user.role
  };
}


module.exports = {
  generateToken,
  getCleanUser
}