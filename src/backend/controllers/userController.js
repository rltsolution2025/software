const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

// Add new user (admin only)
exports.addUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role: "user" });
  await newUser.save();

  res.status(201).json({ message: "User added successfully" });
};

// Block/unblock user
exports.blockUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.blocked = !user.blocked;
  await user.save();

  res.json({ message: `User ${user.blocked ? "blocked" : "unblocked"}` });
};

// Delete user
exports.deleteUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
};
