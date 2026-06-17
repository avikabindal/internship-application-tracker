import { useEffect, useState } from "react";

export default function App() {
  const [applications, setApplications] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH ALL APPLICATIONS
  useEffect(() => {
    fetch("http://localhost:5001/applications")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.applications || [];
        setApplications(list);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load applications");
      })
      .finally(() => setLoading(false));
  }, []);

  // ADD APPLICATION
  const addApplication = () => {
    if (!companyName || !role) return;

    fetch("http://localhost:5001/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        role,
        status: "Applied",
      }),
    })
      .then((res) => res.json())
      .then((newApp) => {
        setApplications((prev) => [...prev, newApp]);
        setCompanyName("");
        setRole("");
      })
      .catch((err) => console.error("POST error:", err));
  };

  // LOADING STATE
  if (loading) {
    return (
      <div>
        <h1>Internship Tracker</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div>
        <h1>Internship Tracker</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Internship Tracker</h1>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add Application</h2>

        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button onClick={addApplication}>Add</button>
      </div>

      {/* LIST */}
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{app.companyName}</h3>
            <p>{app.role}</p>
            <p>Status: {app.status}</p>
          </div>
        ))
      )}
    </div>
  );
}