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

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users,null,2));
}

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  // store user info in session
  req.session.user = { id: user.id, username: user.username, email: user.email, role: user.role };
  res.json({ success: true, user: req.session.user });
});

// REGISTER (students only)
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  let users = loadUsers();

  // Check for duplicate username
  if (users.some((u) => u.username === username)) {
    return res.json({ success: false, message: "Username already taken" });
  }

  // Check for duplicate email
  if (users.some((u) => u.email === email)) {
    return res.json({ success: false, message: "Email already in use" });
  }

  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {id: newId, username, email, password, role: "student", createdEvents: [], bookedEvents: [],};

  users.push(newUser);
  saveUsers(users);

  // Automatically log the new user in
  req.session.user = {id: newUser.id,username: newUser.username,email: newUser.email,role: newUser.role,};

  res.json({ success: true, user: req.session.user });
});

// ADMIN REGISTER
router.post("/admin/register", (req, res) => {
  const currentUser = req.session.user;

  // Only logged-in admins can create new admin accounts
  if (!currentUser || currentUser.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can create admin users" });
  }

  const { username, email, password } = req.body;
  let users = loadUsers();

  // Check for duplicate username
  if (users.some((u) => u.username === username)) {
    return res.json({ success: false, message: "Username already taken" });
  }

  // Check for duplicate email
  if (users.some((u) => u.email === email)) {
    return res.json({ success: false, message: "Email already in use" });
  }

  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {id: newId,username,email,password,role: "admin",      createdEvents: [],bookedEvents: [],};

  users.push(newUser);
  saveUsers(users);

   
  res.json({ success: true });
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

//login and admin login share the same /auth/login backend.
//When distinguishing between admin and student, the determination is based solely on the user.role field 