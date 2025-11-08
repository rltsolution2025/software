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

const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");
if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

exports.savePurchaseOrder = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file); // ✅ Debug log

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const po = new PurchaseOrder({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/purchase_orders/${req.file.filename}`,
    });
    await po.save();

    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        savedName: req.file.filename,
        url: `/uploads/purchase_orders/${req.file.filename}`,
      },
    });
  } catch (err) {
    console.error("Save Purchase Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const files = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    console.error("Get All Purchase Orders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
