// routes/auth.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usersFile = path.join(__dirname, "../data/users.json");

// Helper functions
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch {
    return [];
  }
}

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  // store user info in session
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.json({ success: true, user: req.session.user });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// GET CURRENT USER
router.get("/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

module.exports = router;
