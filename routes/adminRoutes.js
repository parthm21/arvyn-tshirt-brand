const router = require("express").Router();
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid Email" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(400).json({ message: "Wrong Password" });

  req.session.admin = admin._id;
  res.json({ message: "Login Success" });
});

/* CHECK LOGIN */
router.get("/check", (req, res) => {
  if (req.session.admin) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

/* LOGOUT */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged Out" });
});

router.get("/create", async (req, res) => {
  const bcrypt = require("bcrypt");

  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = new Admin({
    email: "admin@arvyn.com",
    password: hashedPassword
  });

  await admin.save();
  res.json({ message: "Admin Created" });
});
module.exports = router;