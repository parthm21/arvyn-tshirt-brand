require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

/* ================= SESSION ================= */
app.use(session({
  secret: "arvynSecretKey",
  resave: false,
  saveUninitialized: false
}));

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= STATIC FOLDERS ================= */

/* uploads folder */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* public folder (frontend) */
app.use(express.static(path.join(__dirname, "public")));

/* ================= ROUTES ================= */
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("ARVYN Backend Running 🚀");
});

/* ================= DATABASE + SERVER START ================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("✅ MongoDB Connected");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🔥 Server Running on port ${PORT}`);
  });

})
.catch(err => {
  console.error("❌ DB Error:", err);
});