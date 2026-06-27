const {
  getAllOpportunities, getOpportunityById,
  createOpportunity, updateOpportunity, deleteOpportunity,
} = require("../models/opportunity.model");

const listOpportunities = async (req, res) => {
  const filters = {};
  if (req.user.role === "student") filters.status = "open";
  if (req.user.role === "company") filters.company_id = req.user.id;

  const { data, error } = await getAllOpportunities(filters);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createOpp = async (req, res) => {
  const {
    company_id, title, description, location, stipend,
    duration, apply_deadline, cgpa_requirement, eligible_branches, skills_required,
  } = req.body;

  if (!company_id || !title) {
    return res.status(400).json({ error: "company_id and title are required" });
  }

  const { data, error } = await createOpportunity({
    company_id, posted_by: req.user.id, title, description,
    location, stipend, duration, apply_deadline,
    cgpa_requirement, eligible_branches, skills_required,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const getOpp = async (req, res) => {
  const { data, error } = await getOpportunityById(req.params.id);
  if (error || !data) return res.status(404).json({ error: "Opportunity not found" });

  if (req.user.role === "company" && data.company_id !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  res.json(data);
};

const updateOpp = async (req, res) => {
  const {
    title, description, location, stipend, duration,
    apply_deadline, cgpa_requirement, eligible_branches, skills_required, status,
  } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (stipend !== undefined) updates.stipend = stipend;
  if (duration !== undefined) updates.duration = duration;
  if (apply_deadline !== undefined) updates.apply_deadline = apply_deadline;
  if (cgpa_requirement !== undefined) updates.cgpa_requirement = cgpa_requirement;
  if (eligible_branches !== undefined) updates.eligible_branches = eligible_branches;
  if (skills_required !== undefined) updates.skills_required = skills_required;
  if (status !== undefined) updates.status = status;

  const { data, error } = await updateOpportunity(req.params.id, updates);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deleteOpp = async (req, res) => {
  const { error } = await deleteOpportunity(req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Opportunity deleted successfully" });
};

module.exports = { listOpportunities, createOpp, getOpp, updateOpp, deleteOpp };