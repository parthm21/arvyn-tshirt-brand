const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  items: Array,
  total: Number,
  customerName: String,
  phone: String,
  address: String,
  status: { type: String, default: "Processing" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);