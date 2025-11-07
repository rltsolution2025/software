const File = require("../models/FileMeta");

// ✅ Upload File
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!req.body.userId) return res.status(400).json({ error: "User ID missing" });

    const fileDoc = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      owner: req.body.userId, // ✅ match schema
      path: req.file.path,
    });

    await fileDoc.save();
    res.json({ success: true, message: "File uploaded successfully!" });
  } catch (err) {
    console.error("File Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Files of a User
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.params.userId }); 
    res.json({ success: true, files });
  } catch (err) {
    console.error("Get User Files Error:", err);
    res.status(500).json({ error: err.message });
  }
};
