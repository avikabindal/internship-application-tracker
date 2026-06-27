const { supabaseAdmin } = require("../database/supabase");

const getStudentById = async (id) => {
  const { data, error } = await supabaseAdmin
    .from("students")
    .select("*, profiles(name, email)")
    .eq("id", id)
    .single();
  return { data, error };
};

const upsertStudent = async (id, fields) => {
  const { data, error } = await supabaseAdmin
    .from("students")
    .upsert({ id, ...fields })
    .select()
    .single();
  return { data, error };
};

const updateStudent = async (id, updates) => {
  const { data, error } = await supabaseAdmin
    .from("students")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
};

module.exports = { getStudentById, upsertStudent, updateStudent };