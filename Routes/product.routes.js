const express = require("express");
const router = express.Router();
const {
  read,
  readById,
  create,
  update,
  remove,
} = require("../Controllers/product.controller");

// get all products
router.get("/product", read);

// get product by id
router.get("/product/:id", readById);

// create product
router.post("/product", create);

// update product
router.put("/product/:id", update);

// delete product
router.delete("/product/:id", remove);
module.exports = router;
