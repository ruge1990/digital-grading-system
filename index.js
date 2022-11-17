const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const userRoutes = require("./routes/user.routes");
const classRoutes = require("./routes/class.routes");
const subjectRoutes = require("./routes/subject.routes");
const testRoutes = require("./routes/test.routes");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    //console.log(JSON.stringify(token));
    if (!token) return next(); //if no token, continue

    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      } else {
        req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/class", classRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/test", testRoutes);

mongoose.connect(process.env.mongoDBUrl,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => app.listen(port, ()=> console.log(`MongoDB connected on port: ${port}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);