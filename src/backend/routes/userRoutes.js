const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getUsers, addUser, blockUser, deleteUser } = require("../controllers/userController");


router.post("/", addUser);
router.get("/",getUsers);


module.exports = router;
