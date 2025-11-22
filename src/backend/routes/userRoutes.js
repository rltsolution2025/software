const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getUsers, addUser, deleteUser, blockUser } = require("../controllers/userController");


router.use(authenticateToken);

router.post("/", addUser);
router.get("/",getUsers);
router.delete("/:id", deleteUser);
router.put("/block/:id", blockUser);



module.exports = router;
