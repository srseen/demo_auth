const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers["authtoken"];
    if (!token) {
      return res.status(401).send("No token");
    }
    // Verify token
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded.user;

    next();
  } catch (err) {
    console.log(err);
    res.send("Token Invalid").status(500);
  }
};
