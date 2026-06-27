const { getStudentById, upsertStudent, updateStudent } = require("../models/student.model");

const getProfile = async (req, res) => {
  const { data, error } = await getStudentById(req.user.id);
  if (error) return res.status(404).json({ error: "Student profile not found" });
  res.json(data);
};

const createProfile = async (req, res) => {
  const { college, branch, graduation_year, cgpa, skills, phone } = req.body;
  const { data, error } = await upsertStudent(req.user.id, {
    college, branch, graduation_year, cgpa, skills, phone,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updateProfile = async (req, res) => {
  const { college, branch, graduation_year, cgpa, skills, phone, resume_url } = req.body;
  const updates = {};
  if (college !== undefined) updates.college = college;
  if (branch !== undefined) updates.branch = branch;
  if (graduation_year !== undefined) updates.graduation_year = graduation_year;
  if (cgpa !== undefined) updates.cgpa = cgpa;
  if (skills !== undefined) updates.skills = skills;
  if (phone !== undefined) updates.phone = phone;
  if (resume_url !== undefined) updates.resume_url = resume_url;

  const { data, error } = await updateStudent(req.user.id, updates);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

module.exports = { getProfile, createProfile, updateProfile };