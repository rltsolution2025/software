const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getUsers, addUser, blockUser, deleteUser } = require("../controllers/userController");

// All routes require authentication
router.use(authenticateToken);

router.get("/", getUsers);             // Get all users
router.post("/", addUser);             // Add new user
router.patch("/block/:id", blockUser); // Block/unblock user
router.delete("/:id", deleteUser);    // Delete user

module.exports = router;
