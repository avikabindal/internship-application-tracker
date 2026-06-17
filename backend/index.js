const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// in-memory database (temporary)
let applications = [];

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("API running");
});

/* CREATE APPLICATION */
app.post("/applications", (req, res) => {
  const newApp = {
    id: Date.now(),
    companyName: req.body.companyName,
    role: req.body.role,
    status: req.body.status || "Applied",
    date: new Date().toISOString()
  };

  applications.push(newApp);
  res.json(newApp);
});

/* GET ALL */
app.get("/applications", (req, res) => {
  res.json(applications);
});

/* UPDATE STATUS */
app.put("/applications/:id", (req, res) => {
  const id = Number(req.params.id);

  applications = applications.map(app => {
    if (app.id === id) {
      return { ...app, ...req.body };
    }
    return app;
  });

  res.json({ message: "Updated successfully" });
});

/* DELETE */
app.delete("/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  applications = applications.filter(app => app.id !== id);

  res.json({ message: "Deleted successfully" });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});