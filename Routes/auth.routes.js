const express = require("express");
const router = express.Router();

router.get("/auth", (req, res) => {
  res.send("Hello Auth!");
});

module.exports = router;
