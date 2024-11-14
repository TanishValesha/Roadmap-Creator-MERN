const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/save-task", authMiddleware, taskController.saveTask);
router.get("/get-task/:userId", authMiddleware, taskController.getAllTasks);
router.put(
  "/update-task/:taskId",
  authMiddleware,
  taskController.updateTaskStatus
);
router.delete(
  "/delete-task/:taskId",
  authMiddleware,
  taskController.deleteTaskById
);

module.exports = router;
