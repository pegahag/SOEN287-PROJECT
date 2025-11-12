// routes/resources.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataFile = path.join(__dirname, "../data/resources.json");

// Helper functions 
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return []; // if file missing or empty
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// ===============================
// Resources
// ===============================

// GET all resources
router.get("/", (req, res) => {
  const resources = loadData();
  res.json(resources);
});

// GET one resource by id
router.get("/:id", (req, res) => {
  const resources = loadData();
  const id = parseInt(req.params.id);
  const resource = resources.find((r) => r.id === id);

  if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
  res.json(resource);
});

// CREATE new resource
router.post("/", (req, res) => {
  const resources = loadData();
  const newResource = req.body;

  newResource.id = resources.length > 0 ? resources[resources.length - 1].id + 1 : 1;
  resources.push(newResource);

  saveData(resources);
  res.json({ success: true, resource: newResource });
});

// UPDATE resource by id
router.put("/:id", (req, res) => {
  const resources = loadData();
  const id = parseInt(req.params.id);
  const updatedData = req.body;

  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Resource not found" });

  resources[index] = { ...resources[index], ...updatedData };
  saveData(resources);

  res.json({ success: true, resource: resources[index] });
});

// DELETE resource by id
router.delete("/:id", (req, res) => {
  let resources = loadData();
  const id = parseInt(req.params.id);

  const exists = resources.some((r) => r.id === id);
  if (!exists) return res.status(404).json({ success: false, message: "Resource not found" });

  resources = resources.filter((r) => r.id !== id);
  saveData(resources);

  res.json({ success: true });
});

module.exports = router;
