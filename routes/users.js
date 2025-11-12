// routes/users.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataFile = path.join(__dirname, "../data/users.json");

// Helper functions 
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// ===============================
// USERS 
// ===============================

// Get all users
router.get("/", (req, res) => {
  const users = loadData();
  res.json(users);
});

// Get a single user by ID
router.get("/:id", (req, res) => {
  const users = loadData();
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ success: false });
  res.json(user);
});

// Add a new user
router.post("/", (req, res) => {
  const users = loadData();
  const newUser = req.body;
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  saveData(users);
  res.json({ success: true, user: newUser });
});

// Update an existing user
router.put("/:id", (req, res) => {
  const users = loadData();
  const id = parseInt(req.params.id);
  const updatedUser = req.body;

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ success: false });

  users[index] = { ...users[index], ...updatedUser };
  saveData(users);
  res.json({ success: true, user: users[index] });
});

// Delete a user
router.delete("/:id", (req, res) => {
  let users = loadData();
  const id = parseInt(req.params.id);
  users = users.filter((u) => u.id !== id);
  saveData(users);
  res.json({ success: true });
});

module.exports = router;
