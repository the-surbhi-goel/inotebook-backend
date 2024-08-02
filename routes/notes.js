const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUserDetails = require("../middleware/fetchUserDetails");

// get-notes-list - Get All notes
// Require authentication
router.get("/get-notes-list", fetchUserDetails, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.send(notes);
});

module.exports = router;
