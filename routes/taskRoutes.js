const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById } = require("../controllers/taskController");

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getTaskById).put(updateTaskById).delete(deleteTaskById);
module.exports = router;
