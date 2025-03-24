const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    //code
    const token = req.headers["authtoken"];
    if (!token) {
      return res.status(401).send("No token");
    }
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded.user;

    next();
  } catch (err) {
    // err
    console.log(err);
    res.send("Token Invalid").status(500);
  }
};
