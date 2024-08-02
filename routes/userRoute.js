const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const fetchUserDetails = require("../middleware/fetchUserDetails");

// Login - To get user-details
// Require authentication
router.get("/get-user-details", fetchUserDetails, async (req, res) => {
  try {
    //Check email-id
    let user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    res.send({
      status: "OK",
      user: user,
    });
  } catch (error) {
    console.error("error ", error);
    return res.status(500).json("Internal server error");
  }
});

module.exports = router;
