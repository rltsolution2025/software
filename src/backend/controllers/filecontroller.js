const File = require("../models/FileMeta");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileDoc = new File({
      filename: req.file.filename,
      path: req.file.path,
      userId: req.body.userId,
    });

    await fileDoc.save();
    res.json({ success: true, message: "File uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get files of a logged in user
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.params.userId });
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
