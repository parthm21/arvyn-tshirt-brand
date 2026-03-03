const router = require("express").Router();
const Order = require("../models/Order");

function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  return "ARVYN" + timestamp + random;
}

router.post("/", async (req, res) => {
  const newOrder = new Order({
    ...req.body,
    orderId: generateOrderId(),
    status: "Processing"
  });

  await newOrder.save();
  res.json(newOrder);
});

router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  res.json(order);
});

router.put("/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

module.exports = router;