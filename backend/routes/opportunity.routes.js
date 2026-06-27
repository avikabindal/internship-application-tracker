const express = require("express");
const router = express.Router();
const {
  listOpportunities, createOpp, getOpp, updateOpp, deleteOpp,
} = require("../controllers/opportunity.controller");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, listOpportunities);
router.post("/", authMiddleware, requireRole("tpo"), createOpp);
router.get("/:id", authMiddleware, getOpp);
router.put("/:id", authMiddleware, requireRole("tpo"), updateOpp);
router.delete("/:id", authMiddleware, requireRole("tpo"), deleteOpp);

module.exports = router;