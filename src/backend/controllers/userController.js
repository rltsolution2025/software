const User = require("../models/User");
const bcrypt = require("bcryptjs");

// PUBLIC create user (no admin, no token)
exports.addUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
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

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        blocked: newUser.blocked,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error while creating user" });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords
    res.json({ users });
  }
  catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = !user.blocked;
    await user.save();
    res.json({ message: `User ${user.blocked ? "blocked" : "unblocked"} successfully` });
  } catch (err) {
    console.error("Error blocking/unblocking user:", err);
    res.status(500).json({ message: "Server error while blocking/unblocking user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};  