const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

router
  .post("/register", userController.registerUser)
  .post("/login", userController.loginUser)
  .get("/logout", userController.logoutUser)
  .get("/current-user", authMiddleware, userController.getCurrentUser)
  .get("/user-check", userController.getUser);

module.exports = router;
