const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST new product (multiple images)
router.post("/", upload.array("images", 2), async (req, res) => {

  const imagePaths = req.files?.map(file => "/uploads/" + file.filename) || [];

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    images: imagePaths
  });

  await product.save();
  res.json(product);
});

// DELETE product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/stock/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  product.stock = !product.stock;   // toggle
  await product.save();

  res.json(product);
});
module.exports = router;