const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");
const fs = require("fs");

// ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= GET PRODUCTS ================= */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});

/* ================= ADD PRODUCT ================= */

router.post("/", upload.array("images", 5), async (req, res) => {

  try {

    const imagePaths = req.files?.map(file => "/uploads/" + file.filename) || [];

    let sizes = [];

    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch {
        sizes = [];
      }
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      sizes: sizes,
      images: imagePaths
    });

    await product.save();

    res.json(product);

  } catch (err) {

    console.error("Product Save Error:", err);

    res.status(500).json({
      error: "Product save failed",
      message: err.message
    });

  }

});

/* ================= DELETE PRODUCT ================= */

router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {

    res.status(500).json({ error: "Delete error" });

  }

});

/* ================= TOGGLE STOCK ================= */

router.put("/stock/:id", async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    product.stock = !product.stock;

    await product.save();

    res.json(product);

  } catch (err) {

    res.status(500).json({ error: "Stock update error" });

  }

});

module.exports = router;