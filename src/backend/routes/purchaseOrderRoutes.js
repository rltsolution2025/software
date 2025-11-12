// routes/purchaseOrderRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const {
  savePurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
  updatePurchaseOrderDelivered
} = require("../controllers/purchaseOrderController");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/purchase_orders");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Add timestamp to avoid overwriting files
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/save", upload.single("file"), savePurchaseOrder);
router.get("/list", getAllPurchaseOrders);
router.put("/mark-sent/:id", updatePurchaseOrderStatus);
router.put("/mark-delivered/:id", updatePurchaseOrderDelivered);




module.exports = router;
