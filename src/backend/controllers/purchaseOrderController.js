const path = require("path");
const fs = require("fs");

// Directory to store purchase orders
const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");

// Ensure the directory exists
if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

// Save uploaded PDF
exports.savePurchaseOrder = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Return filename and URL
    res.json({
      success: true,
      file: {
        name: req.file.filename,
        url: `/uploads/purchase_orders/${req.file.filename}`,
      },
    });
  } catch (err) {
    console.error("Save Purchase Order Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// List all saved PDFs
exports.getAllPurchaseOrders = (req, res) => {
  try {
    if (!fs.existsSync(PO_DIR)) {
      return res.json({ success: true, files: [] });
    }

    const files = fs.readdirSync(PO_DIR).map((file) => ({
      name: file,
      url: `/uploads/purchase_orders/${file}`,
    }));

    res.json({ success: true, files });
  } catch (err) {
    console.error("Get All Purchase Orders Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
