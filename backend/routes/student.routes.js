const express = require("express");
const router = express.Router();
const { getProfile, createProfile, updateProfile } = require("../controllers/student.controller");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, requireRole("student"), getProfile);
router.post("/profile", authMiddleware, requireRole("student"), createProfile);
router.put("/profile", authMiddleware, requireRole("student"), updateProfile);

module.exports = router;