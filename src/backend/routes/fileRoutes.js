const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadFile, getUserFiles } = require("../controllers/filecontroller");

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files/:userId", getUserFiles);

module.exports = router;
