const express = require("express");
const router = express.Router();
const {
  listApplications, apply, getStudentApplications,
  getOpportunityApplications, updateStatus,
} = require("../controllers/application.controller");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, requireRole("tpo"), listApplications);
router.post("/", authMiddleware, requireRole("student"), apply);
router.get("/student/:studentId", authMiddleware, getStudentApplications);
router.get("/opportunity/:id", authMiddleware, requireRole("tpo", "company"), getOpportunityApplications);
router.put("/:id/status", authMiddleware, requireRole("tpo", "company"), updateStatus);

module.exports = router;