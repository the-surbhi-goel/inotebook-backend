const jwt = require("jsonwebtoken");

const JWT_SECRET = "any secret string";

const fetchUserDetails = (req, res, next) => {
  try {
    //get user-details
    const token = req.header("auth-token");
    console.log("token ", token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next();
  } catch (error){
    console.error("error ", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = fetchUserDetails;
