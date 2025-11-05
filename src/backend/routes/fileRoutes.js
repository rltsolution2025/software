const express = require("express");
const multer = require("multer");
const { uploadFile, getUserFiles } = require("../controllers/filecontroller");

const router = express.Router();

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files/:userId", getUserFiles);

module.exports = router;
