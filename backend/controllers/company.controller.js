const { supabaseAdmin } = require("../database/supabase");
const { getAllCompanies, getCompanyById, updateCompany } = require("../models/company.model");

const listCompanies = async (req, res) => {
  const { data, error } = await getAllCompanies();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createCompany = async (req, res) => {
  const { name, email, password, description, website, industry, location, contact_email } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are required" });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: "company" },
  });
  if (authError) return res.status(400).json({ error: authError.message });

  const { data, error } = await updateCompany(authData.user.id, {
    description, website, industry, location, contact_email,
  });
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "Company created successfully", company: data });
};

const getCompany = async (req, res) => {
  const { id } = req.params;

  if (req.user.role === "company" && req.user.id !== id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { data, error } = await getCompanyById(id);
  if (error || !data) return res.status(404).json({ error: "Company not found" });
  res.json(data);
};

const updateCompanyProfile = async (req, res) => {
  const { id } = req.params;

  if (req.user.role === "company" && req.user.id !== id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { description, website, industry, location, contact_email } = req.body;
  const updates = {};
  if (description !== undefined) updates.description = description;
  if (website !== undefined) updates.website = website;
  if (industry !== undefined) updates.industry = industry;
  if (location !== undefined) updates.location = location;
  if (contact_email !== undefined) updates.contact_email = contact_email;

  const { data, error } = await updateCompany(id, updates);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Company deleted successfully" });
};

module.exports = { listCompanies, createCompany, getCompany, updateCompanyProfile, deleteCompany };