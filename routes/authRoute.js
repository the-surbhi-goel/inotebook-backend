const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const JWT_SECRET = "any secret string";

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Check unique email-id
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const salt = await bcrypt.genSaltSync(10);
      const pass = await bcrypt.hashSync(req.body.password, salt);

      User.create({
        name: req.body.name,
        email: req.body.email,
        password: pass,
      })
        .then((user) => {
          const data = {
            user: { id: user.id },
          };

          // var token = jwt.sign(data, jwt_secret);
          const token = jwt.sign(data, JWT_SECRET);

          res.send({
            status: "OK",
            token: token,
            msg: "User created successfully",
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

// Login - It doesn't require authentication
router.post(
  "/login",
  [
    body("email", "Enter Valid email-id").isEmail(),
    body("password", "Enter valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Check email-id
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      //Check password
      const passwordCheck = await bcrypt.compare(req.body.password, user.password);
      if (!passwordCheck) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }

      const data = {
        user: { id: user.id },
      };
      const token = jwt.sign(data, JWT_SECRET);

      res.send({
        status: "OK",
        token: token,
        msg: "User signIn successfully",
      });
    } catch (error) {
      console.error("error ", error);
      return res.status(500).json("Internal server error");
    }
  }
);

module.exports = router;
