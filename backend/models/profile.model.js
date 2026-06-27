const { supabaseAdmin } = require("../database/supabase");

const getProfileById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

const updateProfile = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

module.exports = { getProfileById, updateProfile };