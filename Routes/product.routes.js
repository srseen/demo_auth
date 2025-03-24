const express = require("express");
const router = express.Router();
const {
  read,
  readById,
  create,
  update,
  remove,
} = require("../controllers/product.controller");

// import middleware
const { auth } = require("../middleware/auth");

// get all products
router.get("/product", auth, read);

// get product by id
router.get("/product/:id", auth, readById);

// create product
router.post("/product", auth, create);

// update product
router.put("/product/:id", auth, update);

// delete product
router.delete("/product/:id", auth, remove);
module.exports = router;
