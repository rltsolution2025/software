const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const { login, logout } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ TEMPORARY ROUTE - use only once to create initial admin
router.get("/create-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("adminpass", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    res.send("✅ Admin Created Successfully");
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

// ✅ Authentication routes
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
