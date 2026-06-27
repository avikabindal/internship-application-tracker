const express = require("express");
const router = express.Router();
const { tpoDashboard, studentDashboard, companyDashboard } = require("../controllers/dashboard.controller");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");

router.get("/tpo", authMiddleware, requireRole("tpo"), tpoDashboard);
router.get("/student", authMiddleware, requireRole("student"), studentDashboard);
router.get("/company", authMiddleware, requireRole("company"), companyDashboard);

module.exports = router;