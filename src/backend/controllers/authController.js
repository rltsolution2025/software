const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log("Request:", req.body);

    // ✅ Find user based on username + role
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or role" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "Your account is blocked. Contact admin." });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
   console.log("✅ User authenticated:", user.username);
    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return res.json ({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        username: user.username
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  res.json({ message: "Logged out" });
};

module.exports = { login, logout };
