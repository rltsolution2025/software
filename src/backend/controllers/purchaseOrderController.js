// const path = require("path");
// const fs = require("fs");
// const PurchaseOrder = require("../models/purchaseOrder");

// const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");
// if (!fs.existsSync(PO_DIR)) {
//   fs.mkdirSync(PO_DIR, { recursive: true });
// }

// exports.savePurchaseOrder = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     // Extract additional fields from request body
//     const { deliveryPeriod, totalAmount, make } = req.body;

//     const po = new PurchaseOrder({
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       url: `/uploads/purchase_orders/${req.file.filename}`,
//       deliveryPeriod: deliveryPeriod || "12 weeks",
//       totalAmount: totalAmount || 0,
//       make: make || "",
//       status: "Pending",   // default
//     });

//     await po.save();

//     res.json({
//       success: true,
//       file: {
//         name: req.file.originalname,
//         savedName: req.file.filename,
//         url: `/uploads/purchase_orders/${req.file.filename}`,
//         deliveryPeriod: po.deliveryPeriod,
//         totalAmount: po.totalAmount,
//         make: po.make,
//       },
//     });
//     console.log("Saved PO Details:", { deliveryPeriod, totalAmount, make });
//   } catch (err) {
//     console.error("Save Purchase Order Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getAllPurchaseOrders = async (req, res) => {
//   try {
//     const files = await PurchaseOrder.find().sort({ createdAt: -1 });
//     res.json({ success: true, files });
//   } catch (err) {
//     console.error("Get All Purchase Orders Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// exports.updatePurchaseOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const po = await PurchaseOrder.findById(id);

//     if (!po) {
//       return res.status(404).json({ success: false, message: "Purchase Order not found" });
//     }

//     // Update status to Sent
//     po.status = "Sent";
//     po.sentDate = new Date();

//     // Calculate delivery date based on deliveryPeriod
//     const match = po.deliveryPeriod.match(/(\d+)\s*(week|weeks|day|days)/i);
//     let deliveryDays = 14; // default 2 weeks

//     if (match) {
//       const number = parseInt(match[1]);
//       const unit = match[2].toLowerCase();
//       deliveryDays = unit.includes("week") ? number * 7 : number;
//     }

//     const expectedDate = new Date();
//     expectedDate.setDate(expectedDate.getDate() + deliveryDays);
//     po.deliveryDate = expectedDate;

//     await po.save();

//     res.json({
//       success: true,
//       message: "Status updated to Sent",
//       po,
//     });
//   } catch (err) {
//     console.error("Update PO Status Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const path = require("path");
const fs = require("fs");
const PurchaseOrder = require("../models/purchaseOrder");

const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");
if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

// ✅ Save new Purchase Order
exports.savePurchaseOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Extract additional fields from request body
    const { deliveryPeriod, totalAmount, make, senderEmail, senderPhone } = req.body;

    const po = new PurchaseOrder({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/purchase_orders/${req.file.filename}`,
      deliveryPeriod: deliveryPeriod || "12 weeks",
      totalAmount: totalAmount || 0,
      make: make || "",
      senderEmail: senderEmail || "", // ✅ new
      senderPhone: senderPhone || "", // ✅ new
      status: "Pending", // default
    });

    await po.save();

    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        savedName: req.file.filename,
        url: `/uploads/purchase_orders/${req.file.filename}`,
        deliveryPeriod: po.deliveryPeriod,
        totalAmount: po.totalAmount,
        make: po.make,
        senderEmail: po.senderEmail,
        senderPhone: po.senderPhone,
      },
    });

    console.log("Saved PO Details:", { deliveryPeriod, totalAmount, make, senderEmail, senderPhone });
  } catch (err) {
    console.error("Save Purchase Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all POs
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const files = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    console.error("Get All Purchase Orders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark PO as Sent
exports.updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderEmail, senderPhone } = req.body; // ✅ include sender info
    const po = await PurchaseOrder.findById(id);

    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    // Update status to Sent
    po.status = "Sent";
    po.sentDate = new Date();

    // Optional: store sender info if provided
    if (senderEmail) po.senderEmail = senderEmail;
    if (senderPhone) po.senderPhone = senderPhone;

    // Calculate delivery date based on deliveryPeriod
    const match = po.deliveryPeriod.match(/(\d+)\s*(week|weeks|day|days)/i);
    let deliveryDays = 14; // default 2 weeks

    if (match) {
      const number = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      deliveryDays = unit.includes("week") ? number * 7 : number;
    }

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + deliveryDays);
    po.deliveryDate = expectedDate;

    await po.save();

    res.json({
      success: true,
      message: "Status updated to Sent",
      po,
    });
  } catch (err) {
    console.error("Update PO Status Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: Mark PO as Received
exports.markPurchaseOrderReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id);

    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    po.status = "Delivered";
    po.receivedDate = new Date();

    await po.save();

    res.json({
      success: true,
      message: "Purchase Order marked as Received",
      po,
    });
  } catch (err) {
    console.error("Mark PO Received Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


