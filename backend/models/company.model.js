const { supabaseAdmin } = require("../database/supabase");

const getAllCompanies = async () => {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("*, profiles(name, email)");
  return { data, error };
};

const getCompanyById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("*, profiles(name, email)")
    .eq("id", id)
    .single();
  return { data, error };
};

const updateCompany = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

module.exports = { getAllCompanies, getCompanyById, updateCompany };