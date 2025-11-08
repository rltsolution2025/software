// const path = require("path");
// const fs = require("fs");
// const PurchaseOrder = require("../models/purchaseOrder"); // <-- new schema

// // Directory to store purchase orders
// const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");

// // Ensure the directory exists
// if (!fs.existsSync(PO_DIR)) {
//   fs.mkdirSync(PO_DIR, { recursive: true });
// }

// // Save uploaded PDF
// exports.savePurchaseOrder = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     // Save to MongoDB
//     const po = new PurchaseOrder({
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       url: `/uploads/purchase_orders/${req.file.filename}`,
//     });
//     await po.save();

//     res.json({
//       success: true,
//     //   file: po, // Return saved record
//      file: {
//       name: req.file.originalname, // <-- use original name for display
//       savedName: req.file.filename, // <-- actual saved filename on server
//       url: `/uploads/purchase_orders/${req.file.filename}`,
//     },
//     });
//   } catch (err) {
//     console.error("Save Purchase Order Error:", err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// // List all saved PDFs
// exports.getAllPurchaseOrders = async (req, res) => {
//   try {
//     const files = await PurchaseOrder.find().sort({ createdAt: -1 });
//     res.json({ success: true, files });
//   } catch (err) {
//     console.error("Get All Purchase Orders Error:", err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };  
const path = require("path");
const fs = require("fs");
const PurchaseOrder = require("../models/purchaseOrder");

// Directory to store purchase orders
const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");

// Ensure the directory exists
if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

// ✅ Save uploaded PDF
exports.savePurchaseOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Save to MongoDB
    const po = new PurchaseOrder({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/purchase_orders/${req.file.filename}`,
    });
    await po.save();

    res.json({
      success: true,
      file: {
        name: req.file.originalname,  // for frontend display
        savedName: req.file.filename, // actual saved filename
        url: `/uploads/purchase_orders/${req.file.filename}`,
      },
    });
  } catch (err) {
    console.error("Save Purchase Order Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ List all saved PDFs
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const files = await PurchaseOrder.find().sort({ createdAt: -1 });

    // 🟢 Ensure each returned file includes a human-readable name
    const formattedFiles = files.map((po) => ({
      name: po.originalName || po.filename,
      url: po.url,
    }));

    res.json({ success: true, files: formattedFiles });
  } catch (err) {
    console.error("Get All Purchase Orders Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
