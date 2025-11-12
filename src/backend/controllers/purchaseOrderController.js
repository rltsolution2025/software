// const path = require("path");
// const fs = require("fs");
// const PurchaseOrder = require("../models/purchaseOrder");

// const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");
// if (!fs.existsSync(PO_DIR)) {
//   fs.mkdirSync(PO_DIR, { recursive: true });
// }

// // ✅ Save new Purchase Order
// exports.savePurchaseOrder = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const { deliveryPeriod, totalAmount, make, senderEmail, senderPhone } = req.body;

//     const po = new PurchaseOrder({
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       url: `/uploads/purchase_orders/${req.file.filename}`,
//       deliveryPeriod: deliveryPeriod || "12 weeks",
//       totalAmount: totalAmount || 0,
//       make: make || "",
//       senderEmail: senderEmail || "",
//       senderPhone: senderPhone || "",
//       status: "Pending",
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
//         senderEmail: po.senderEmail,
//         senderPhone: po.senderPhone,
//       },
//     });

//     console.log("Saved PO Details:", { deliveryPeriod, totalAmount, make, senderEmail, senderPhone });
//   } catch (err) {
//     console.error("Save Purchase Order Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get all POs
// exports.getAllPurchaseOrders = async (req, res) => {
//   try {
//     const files = await PurchaseOrder.find().sort({ createdAt: -1 });
//     res.json({ success: true, files });
//   } catch (err) {
//     console.error("Get All Purchase Orders Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Mark PO as Sent
// exports.updatePurchaseOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { senderEmail, senderPhone } = req.body;
//     const po = await PurchaseOrder.findById(id);

//     if (!po) {
//       return res.status(404).json({ success: false, message: "Purchase Order not found" });
//     }

//     po.status = "Sent";

//     // ✅ Set sentDate only if not already set
//     if (!po.sentDate) po.sentDate = new Date();

//     if (senderEmail) po.senderEmail = senderEmail;
//     if (senderPhone) po.senderPhone = senderPhone;

//     // ✅ Calculate expected delivery only once (after marking Sent)
//     if (!po.deliveryDate) {
//       const match = po.deliveryPeriod.match(/(\d+)\s*(week|weeks|day|days)/i);
//       let deliveryDays = 14; // default 2 weeks

//       if (match) {
//         const number = parseInt(match[1]);
//         const unit = match[2].toLowerCase();
//         deliveryDays = unit.includes("week") ? number * 7 : number;
//       }

//       const expectedDate = new Date(po.sentDate);
//       expectedDate.setDate(expectedDate.getDate() + deliveryDays);
//       po.deliveryDate = expectedDate;
//     }

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

// // ✅ Mark PO as Delivered
// exports.updatePurchaseOrderDelivered = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const po = await PurchaseOrder.findById(id);

//     if (!po) {
//       return res.status(404).json({ success: false, message: "Purchase Order not found" });
//     }

//     po.status = "Delivered";

//     // ✅ Set receivedDate only when delivered
//     if (!po.receivedDate) po.receivedDate = new Date();

//     // ❌ Do NOT touch sentDate or deliveryDate (they remain unchanged)

//     await po.save();

//     res.json({
//       success: true,
//       message: "Purchase Order marked as Delivered",
//       po,
//     });
//   } catch (err) {
//     console.error("Update PO Delivered Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const PurchaseOrder = require("../models/purchaseOrder");

const PO_DIR = path.join(__dirname, "../uploads/purchase_orders");
if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

// ✅ Email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app-specific password
  },
});

// ✅ Save new Purchase Order
exports.savePurchaseOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { deliveryPeriod, totalAmount, make, senderEmail, senderPhone } = req.body;

    const po = new PurchaseOrder({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/purchase_orders/${req.file.filename}`,
      deliveryPeriod: deliveryPeriod || "12 weeks",
      totalAmount: totalAmount || 0,
      make: make || "",
      senderEmail: senderEmail || "",
      senderPhone: senderPhone || "",
      status: "Pending",
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

// ✅ Mark PO as Sent + Send Email
exports.updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderEmail, senderPhone } = req.body;
    const po = await PurchaseOrder.findById(id);

    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    po.status = "Sent";

    if (!po.sentDate) po.sentDate = new Date();

    if (senderEmail) po.senderEmail = senderEmail;
    if (senderPhone) po.senderPhone = senderPhone;

    // Calculate expected delivery only once
    if (!po.deliveryDate) {
      const match = po.deliveryPeriod.match(/(\d+)\s*(week|weeks|day|days)/i);
      let deliveryDays = 14; // default 2 weeks

      if (match) {
        const number = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        deliveryDays = unit.includes("week") ? number * 7 : number;
      }

      const expectedDate = new Date(po.sentDate);
      expectedDate.setDate(expectedDate.getDate() + deliveryDays);
      po.deliveryDate = expectedDate;
    }

    await po.save();

    // -----------------------------
    // ✅ Send email with attachment
    // -----------------------------
    try {
      const emailBody = `
Dear ${po.vendorName || "Client"},

Greetings!

Please find attached the Purchase Order (PO No. ${po.referenceNo || po._id}) for the supply of ${
        po.make || "materials/services"
      } as discussed and finalized.

Kindly review the PO and acknowledge receipt. If you require any further clarification or documentation, please feel free to contact us.

We appreciate your support and look forward to your confirmation.

Thanks & Regards,
RL Technologies Pvt. Ltd
      `;

      const filePath = path.join(PO_DIR, po.filename);

      const mailOptions = {
        from: `"RL Technologies Pvt. Ltd" <${process.env.EMAIL_USER}>`,
        to: po.senderEmail || "client@example.com",  // client email
        cc: "purchase@rltech.com",                  // internal CC
        subject: `Purchase Order (PO No. ${po.referenceNo || po._id}) - RL Technologies Pvt. Ltd`,
        text: emailBody,
        attachments: [
          {
            filename: po.originalName || po.filename,
            path: filePath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${po.senderEmail} (CC: social.rltdigital@gmail.com)`);
    } catch (mailErr) {
      console.error("Email sending error:", mailErr);
    }

    res.json({
      success: true,
      message: "Status updated to Sent and email sent successfully",
      po,
    });
    console.log("Updated PO Status to Sent:", id);
  } catch (err) {
    console.error("Update PO Status Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark PO as Delivered
exports.updatePurchaseOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const po = await PurchaseOrder.findById(id);

    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    po.status = "Delivered";

    if (!po.receivedDate) po.receivedDate = new Date();

    await po.save();

    res.json({
      success: true,
      message: "Purchase Order marked as Delivered",
      po,
    });
  } catch (err) {
    console.error("Update PO Delivered Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


