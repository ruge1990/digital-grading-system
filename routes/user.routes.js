const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", (req, res) => {
  res.send("this works!");
})

router.post("/login", userController.login);

router.get("/verify", userController.verify_token);

router.post("/create", userController.create_user);

router.get("/list", userController.list_user);

router.put("/update/:id", userController.update_user);

router.delete("/delete/:id", userController.delete_user);

router.get("/:id", userController.get_user);

module.exports = router;