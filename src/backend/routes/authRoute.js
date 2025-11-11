const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { login, logout } = require("../controllers/authController");

const router = express.Router();

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

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if username already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = await User.create({
//       username,
//       password: hashedPassword,
//       role: "user", // default role
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: { id: newUser._id, username: newUser.username, role: newUser.role },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Error registering user" });
//   }
// });


router.post("/login", login);
router.post("/logout", logout);

module.exports = router;