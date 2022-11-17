const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.post("/create", subjectController.create_subject);

router.get("/list", subjectController.list_subject);

router.get("/:id", subjectController.get_subject);

router.put("/update/:id", subjectController.update_subject);

router.get("/archive/:id", subjectController.archive_subject);

router.delete("/delete/:id", subjectController.delete_subject);

module.exports = router;