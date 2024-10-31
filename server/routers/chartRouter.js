const express = require("express");
const router = express.Router();
const roadmapController = require("../controller/roadmapController");

router.post("/save", roadmapController.saveGraph);
router.get("/graphs-db/:userId", roadmapController.getGraphs);
router.get("/graphs-db/import/:graphId", roadmapController.getGraphById);
router.delete("/graphs-db/delete/:graphId", roadmapController.deleteGraphById);

module.exports = router;
