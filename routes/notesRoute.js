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

// update-note - Update Existing Note
// - /api/note/update-note
router.put(
  "/update-note/:id",
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
      const note = await Notes.findById(req.params.id);
      // If note doesn't exist
      if (!note) {
        return res.status(404).json({ error: "Not Found" });
      }

      // If author doesn't match
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const newNote = {
        title: req.body.title,
        description: req.body.description,
      };

      //{new: true}: It there is new content, It'll create new entry
      await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

      res.send({
        status: "OK",
        msg: "Note updated successfully",
      });
    } catch (error) {
      console.error("error ", error);
      return res.status(500).json("Internal server error");
    }
  }
);

module.exports = router;
