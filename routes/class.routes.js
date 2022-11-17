const express = require("express");
const router = express.Router();
const classController = require("../controllers/class.controller");


router.post("/create", classController.create_class);

router.get("/list", classController.list_class);

router.put("/update/:id", classController.update_class);

router.delete("/delete/:id", classController.delete_class);

router.post("/:id/pupil/assign", classController.assign_pupil);

router.post("/pupil/contain", classController.contain_pupil);

module.exports = router;