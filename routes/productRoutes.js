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

/* ================= GET ALL PRODUCTS ================= */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= ADD PRODUCT ================= */

router.post("/", upload.array("images", 2), async (req, res) => {

  try {

    const imagePaths = req.files?.map(file => "/uploads/" + file.filename) || [];

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      sizes: JSON.parse(req.body.sizes || "[]"),
      images: imagePaths
    });

    await product.save();

    res.json(product);

  } catch (err) {
    console.error("Product save error:", err);
    res.status(500).json({ error: "Server error" });
  }

});

/* ================= DELETE PRODUCT ================= */

router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {

    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });

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

    console.error("Stock update error:", err);
    res.status(500).json({ error: "Server error" });

  }

});

module.exports = router;