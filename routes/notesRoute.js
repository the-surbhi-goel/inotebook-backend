const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Notes = require("../models/NotesModel");
const fetchUserDetails = require("../middleware/fetchUserDetails");

// get-notes-list- Get All notes
// - "/api/note/add-notes-list"
router.get("/get-notes-list", fetchUserDetails, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.error("error ", error);
    return res.status(500).json("Internal server error");
  }
});

// add-note - Add Note
// - /api/note/add-note
router.post(
  "/add-note",
  fetchUserDetails,
  [
    body("title", "Enter Valid Title").isLength({ min: 3 }),
    body("description", "Enter Valid description").isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      Notes.create({
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        user: req.user.id,
      })
        .then((noteRes) => {
          res.send({
            status: "OK",
            msg: "Note created successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ error: err.errmsg });
        });
    } catch (error) {
      console.error("error ", error);
      return res.status(500).json("Internal server error");
    }
  }
);

module.exports = router;
