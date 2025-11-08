const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true }
  },
  {
timestamps: true
  }     // e.g., "/uploads/purchase_orders/Purchase_Order-Item1-123.pdf"
  
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
