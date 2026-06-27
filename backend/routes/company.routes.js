const express = require("express");
const router = express.Router();
const {
  listCompanies, createCompany, getCompany,
  updateCompanyProfile, deleteCompany,
} = require("../controllers/company.controller");
const { authMiddleware, requireRole } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, requireRole("tpo"), listCompanies);
router.post("/", authMiddleware, requireRole("tpo"), createCompany);
router.get("/:id", authMiddleware, requireRole("tpo", "company"), getCompany);
router.put("/:id", authMiddleware, requireRole("tpo", "company"), updateCompanyProfile);
router.delete("/:id", authMiddleware, requireRole("tpo"), deleteCompany);

module.exports = router;