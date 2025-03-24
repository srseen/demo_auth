const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    // 1.Check User
    const { name, password } = req.body;
    var user = await User.findOne({ name });
    if (user) {
      return res.status(400).send("User Already Exists!!!");
    }
    // 2.Encrypt
    const salt = await bcrypt.genSalt(10);
    user = new User({
      name,
      password,
    });
    user.password = await bcrypt.hash(password, salt);
    // 3.Save
    await user.save();
    res.status(200).send("Register Success!!");
  } catch (err) {
    //code
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    //code
    // 1. Check User
    const { name, password } = req.body;
    var user = await User.findOne({ name });
    if (!user) {
      return res.status(400).send("User not found!!!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Password Invalid!!!");
    }
    // 2. Payload
    var payload = {
      user: {
        name: user.name,
      },
    };
    // 3. Generate
    jwt.sign(payload, "jwtsecret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
