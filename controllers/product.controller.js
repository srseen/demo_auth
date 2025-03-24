const Product = require("../Models/product.model");

// read function is used to get all products from the database.
const read = async (req, res) => {
  try {
    const producted = await Product.find({}).exec();
    res.send(producted);
  } catch (err) {
    console.log(err);
    res.send("Product Not Found!");
    res.status(500).send("server error!");
  }
};

// readById function is used to get a product by id from the database.
const readById = async (req, res) => {
  try {
    const id = req.params.id;
    const producted = await Product.findOne({ _id: id }).exec();
    res.send(producted);
  } catch (err) {
    console.log(err);
    res.send("Product Not Found!");
    res.status(500).send("server error!");
  }
};

// create function is used to create a product in the database.
const create = async (req, res) => {
  try {
    console.log(req.body);
    const producted = await Product(req.body).save();
    res.send(producted);
  } catch (err) {
    console.log(err);
    res.send("Product Not Created!");
    res.status(500).send("server error!");
  }
};

// update function is used to update a product in the database.
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    res.send(updated);
  } catch (err) {
    console.log(err);
    res.send("Product Not Updated!");
    res.status(500).send("server error!");
  }
};

// remove function is used to remove a product from the database.
const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Product.findOneAndDelete({ _id: id }).exec();
    res.send(removed);
  } catch (err) {
    console.log(err);
    res.send("Product Not Removed!");
    res.status(500).send("server error!");
  }
};

module.exports = {
  read,
  readById,
  create,
  update,
  remove,
};
