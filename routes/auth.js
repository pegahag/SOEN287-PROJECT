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
  req.session.user = { id: user.id,
                       username: user.username,
                      role: user.role };
  res.json({ success: true, user: req.session.user });
});

//REGISTER
router.post("/register" , (req,res) => {
  const {username,password} = req.body;
  let users = loadUsers();

  if (users.some((u) => u.username === username)) {
    return res.json({ success: false, message: "Username already taken" });
  }

  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

   const newUser = {
    id: newId,
    username,
    password,
    role: "student", //register only happened in student. (in reality u cannot register as an admin! [I believe])
    createdEvents: [],
    bookedEvents: []
  };

  users.push(newUser);
  saveUsers(users);

  // finished regsiter 
  req.session.user = {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role
  };

  res.json({ success: true, user: req.session.user });

})


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