const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/save-note", authMiddleware, noteController.saveNote);
router.get("/get-note/:userId", authMiddleware, noteController.getNote);
router.put("/update-note/:noteId", authMiddleware, noteController.updateNote);

module.exports = router;
