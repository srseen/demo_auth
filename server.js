// import libraries
const express = require("express");
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// import database connection
const connectDB = require("./Config/db");

// import environment variables
require("dotenv").config();
const port = process.env.PORT;

// create express app
const app = express();

// connect to database
connectDB();

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// route
app.get("/", (req, res) => {
  res.send("Hello Server!");
});

// route middleware
readdirSync("./Routes").map((r) => app.use("/api", require(`./Routes/${r}`)));

// listen to port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
