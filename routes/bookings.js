// routes/bookings.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const bookingsFile = path.join(__dirname, "../data/bookings.json");
const resourcesFile = path.join(__dirname, "../data/resources.json");

// Helper functions 
function load(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ===============================
// BOOKINGS
// ===============================

// Get all bookings
router.get("/", (req, res) => {
  const bookings = load(bookingsFile);
  res.json(bookings);
});

// Get a specific booking
router.get("/:id", (req, res) => {
  const bookings = load(bookingsFile);
  const id = parseInt(req.params.id);
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return res.status(404).json({ success: false });
  res.json(booking);
});

// Create a new booking
router.post("/", (req, res) => {
  const bookings = load(bookingsFile);
  const resources = load(resourcesFile);

  const newBooking = req.body;
  newBooking.id = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;

  // Update seats for the resource
  const resource = resources.find((r) => r.id === newBooking.resourceId);
  if (resource) {
    resource.seatsTaken = (resource.seatsTaken || 0) + 1;
    if (resource.seatsTaken >= resource.capacity) {
      resource.status = "blocked";
    }
    save(resourcesFile, resources);
  }

  bookings.push(newBooking);
  save(bookingsFile, bookings);
  res.json({ success: true, booking: newBooking });
});

// Update a booking
router.put("/:id", (req, res) => {
  const bookings = load(bookingsFile);
  const id = parseInt(req.params.id);
  const updated = req.body;

  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return res.status(404).json({ success: false });

  bookings[index] = { ...bookings[index], ...updated };
  save(bookingsFile, bookings);
  res.json({ success: true, booking: bookings[index] });
});

// Delete a booking
router.delete("/:id", (req, res) => {
  let bookings = load(bookingsFile);
  const id = parseInt(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  save(bookingsFile, bookings);
  res.json({ success: true });
});

module.exports = router;