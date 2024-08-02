const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../models/User");

// Create User : POST "/api/auth/signup"
// It doesn't require authentication
router.post(
  "/signup",
  [
    // body(param, errorMsg)
    body("name", "Enter Valid name").isLength({ min: 3 }),
    body("email", "Enter Valid email-id").isEmail(),
    body("password", "Minimum length of password must be 5").isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) =>
        res.send({
          status: "OK",
          msg: "User created successfully",
        })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json({ error: err.errmsg });
      });
  }
);

module.exports = router;
