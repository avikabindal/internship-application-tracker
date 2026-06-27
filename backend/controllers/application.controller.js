const { supabaseAdmin } = require("../database/supabase");
const {
  getAllApplications, getApplicationsByStudent, getApplicationsByOpportunity,
  createApplication, updateApplicationStatus, getApplicationById,
} = require("../models/application.model");

const listApplications = async (req, res) => {
  const { data, error } = await getAllApplications();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const apply = async (req, res) => {
  const { opportunity_id, cover_note } = req.body;
  if (!opportunity_id) return res.status(400).json({ error: "opportunity_id is required" });

  const { data: opp } = await supabaseAdmin
    .from("opportunities").select("status").eq("id", opportunity_id).single();

  if (!opp || opp.status !== "open") {
    return res.status(400).json({ error: "This opportunity is not open for applications" });
  }

  const { data, error } = await createApplication({
    opportunity_id, student_id: req.user.id, cover_note,
  });

  if (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "You have already applied for this opportunity" });
    }
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
};

const getStudentApplications = async (req, res) => {
  const { studentId } = req.params;

  if (req.user.role === "student" && req.user.id !== studentId) {
    return res.status(403).json({ error: "Access denied" });
  }
  if (req.user.role === "company") {
    return res.status(403).json({ error: "Access denied" });
  }

  const { data, error } = await getApplicationsByStudent(studentId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getOpportunityApplications = async (req, res) => {
  const { id } = req.params;

  if (req.user.role === "company") {
    const { data: opp } = await supabaseAdmin
      .from("opportunities").select("company_id").eq("id", id).single();
    if (!opp || opp.company_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
  }

  const { data, error } = await getApplicationsByOpportunity(id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });

  if (req.user.role === "company") {
    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(403).json({ error: "Companies can only shortlist or reject applicants" });
    }
    const { data: app } = await getApplicationById(id);
    const { data: opp } = await supabaseAdmin
      .from("opportunities").select("company_id").eq("id", app?.opportunity_id).single();
    if (!opp || opp.company_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
  }

  const { data, error } = await updateApplicationStatus(id, status, remarks);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Status updated successfully", application: data });
};

module.exports = { listApplications, apply, getStudentApplications, getOpportunityApplications, updateStatus };