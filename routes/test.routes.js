const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");

router.post("/create", testController.create_test);

router.get("/list", testController.list_test);

router.put("/update/:id", testController.update_test);

router.delete("/delete/:id", testController.delete_test);

router.get("/:id", testController.get_test);

router.post("/:id/grade/create", testController.create_grade);

router.put("/:id/grade/update", testController.update_grade);

router.delete("/:id/grade/delete", testController.delete_grade);

router.get("/:id/grade/:pupilID", testController.get_grade);

module.exports = router;