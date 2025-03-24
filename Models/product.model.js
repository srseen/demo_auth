const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    detail: { type: String },
    price: { type: Number },
  },
  //   timestamps: true will give us createdAt and updatedAt fields
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
