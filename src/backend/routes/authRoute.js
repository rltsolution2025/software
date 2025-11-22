// const express = require("express");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const { login, logout } = require("../controllers/authController");

// const router = express.Router();

// router.get("/create-admin", async (req, res) => {
//   try {
//     const existingAdmin = await User.findOne({ username: "admin" });

//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const hashedPassword = await bcrypt.hash("adminpass", 10);

//     await User.create({
//       username: "admin",
//       password: hashedPassword,
//       role: "admin",
//     });

//     res.send("✅ Admin Created Successfully");
//   } catch (error) {
//     res.status(500).json({ message: "Error creating admin", error });
//   }
// });


// router.post("/login", login);
// router.post("/logout", logout);

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { login, logout } = require("../controllers/authController");

const router = express.Router();

// ----------------------
// CREATE ADMIN (already)
// ----------------------
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

// ----------------------
// CREATE NORMAL USER
// ----------------------
// router.post("/create-user", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if username exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     await User.create({
//       username,
//       password: hashedPassword,
//       role: "user",
//     });

//     res.status(201).json({ message: "✅ User Created Successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user", error });
//   }
// });

// Login

router.post("/create-user", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "user",     // default role
      blocked: false,
    });

    await newUser.save();

    res.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});


router.post("/login", login);

// Logout
router.post("/logout", logout);

module.exports = router;
