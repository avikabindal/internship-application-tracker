const { supabaseAdmin, supabaseAuth } = require("../database/supabase");
const { getProfileById } = require("../models/profile.model");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "name, email, password, and role are required" });
  }
  if (!["tpo", "student", "company"].includes(role)) {
    return res.status(400).json({ error: "role must be tpo, student, or company" });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });

  if (error) return res.status(400).json({ error: error.message });

  if (role === "student") {
    await supabaseAdmin.from("students").insert({ id: data.user.id });
  }
  if (role === "company") {
    await supabaseAdmin.from("companies").insert({ id: data.user.id });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: { id: data.user.id, email, name, role },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: "Invalid email or password" });

  const { data: profile } = await getProfileById(data.user.id);

  res.json({
    message: "Login successful",
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profile?.name,
      role: profile?.role,
    },
  });
};

const logout = async (req, res) => {
  await supabaseAuth.auth.signOut();
  res.json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  const { data, error } = await getProfileById(req.user.id);
  if (error) return res.status(404).json({ error: "Profile not found" });
  res.json(data);
};

module.exports = { register, login, logout, getMe };