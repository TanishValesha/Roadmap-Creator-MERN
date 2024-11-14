const express = require("express");
const router = express.Router();
const roadmapController = require("../controller/roadmapController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/save", authMiddleware, roadmapController.saveGraph);
router.get(
  "/graphs-db/:userId",
  authMiddleware,
  roadmapController.getPrivateGraphs
);
router.get("/graphs-db", authMiddleware, roadmapController.getPublicGraphs);
router.get(
  "/graphs-db/import/:graphId",
  authMiddleware,
  roadmapController.getGraphById
);
router.delete(
  "/graphs-db/delete/:graphId",
  authMiddleware,
  roadmapController.deleteGraphById
);

module.exports = router;
