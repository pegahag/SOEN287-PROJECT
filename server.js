const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Setup express-session
app.use(
  session({
    secret: "securityismypassion",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/auth", require("./routes/auth"));

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
