const { supabaseAdmin } = require("../database/supabase");

const tpoDashboard = async (req, res) => {
  const [companies, opportunities, applications, students] = await Promise.all([
    supabaseAdmin.from("companies").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("opportunities").select("id, status"),
    supabaseAdmin.from("applications").select("id, status"),
    supabaseAdmin.from("students").select("id", { count: "exact", head: true }),
  ]);

  const oppData = opportunities.data || [];
  const appData = applications.data || [];

  res.json({
    total_companies: companies.count || 0,
    total_students: students.count || 0,
    total_opportunities: oppData.length,
    open_opportunities: oppData.filter(o => o.status === "open").length,
    total_applications: appData.length,
    shortlisted: appData.filter(a => a.status === "shortlisted").length,
    selected: appData.filter(a => a.status === "selected").length,
    rejected: appData.filter(a => a.status === "rejected").length,
  });
};

const studentDashboard = async (req, res) => {
  const { data: apps, error } = await supabaseAdmin
    .from("applications")
    .select("status, opportunities(title, companies(profiles(name)))")
    .eq("student_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    total_applications: apps.length,
    applied: apps.filter(a => a.status === "applied").length,
    under_review: apps.filter(a => a.status === "under_review").length,
    shortlisted: apps.filter(a => a.status === "shortlisted").length,
    selected: apps.filter(a => a.status === "selected").length,
    rejected: apps.filter(a => a.status === "rejected").length,
    recent: apps.slice(0, 5),
  });
};

const companyDashboard = async (req, res) => {
  const { data: opps, error: oppError } = await supabaseAdmin
    .from("opportunities")
    .select("id, title, status")
    .eq("company_id", req.user.id);

  if (oppError) return res.status(500).json({ error: oppError.message });

  const oppIds = opps.map(o => o.id);
  let appStats = { total: 0, shortlisted: 0, rejected: 0 };

  if (oppIds.length > 0) {
    const { data: apps } = await supabaseAdmin
      .from("applications").select("status").in("opportunity_id", oppIds);

    if (apps) {
      appStats = {
        total: apps.length,
        shortlisted: apps.filter(a => a.status === "shortlisted").length,
        rejected: apps.filter(a => a.status === "rejected").length,
      };
    }
  }

  res.json({
    total_opportunities: opps.length,
    open_opportunities: opps.filter(o => o.status === "open").length,
    ...appStats,
    opportunities: opps,
  });
};

module.exports = { tpoDashboard, studentDashboard, companyDashboard };