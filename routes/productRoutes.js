const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");

const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

/* CLOUDINARY STORAGE */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "arvyn-products"
  }
});

const upload = multer({ storage });

/* GET PRODUCTS */

router.get("/", async (req, res) => {

  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {

    console.log("FETCH ERROR:", err);

    res.status(500).json({ error: "Fetch error" });

  }

});

/* ADD PRODUCT */

router.post("/", upload.array("images", 5), async (req, res) => {
  
   console.log("FILES:", req.files);
  console.log("BODY:", req.body);
  

  try {

    const images = req.files.map(file => file.path);

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
      images: images
    });

    await product.save();

    res.json(product);

  } catch (err) {

    console.log("UPLOAD ERROR:", err);

    res.status(500).json({ error: err.message });

  }

});

/* DELETE PRODUCT */

router.delete("/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {

    res.status(500).json({ error: "Delete error" });

  }

});

/* STOCK */

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