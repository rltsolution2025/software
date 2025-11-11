// const mongoose = require("mongoose");

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     filename: { type: String, required: true },
//     originalName: { type: String, required: true },
//     url: { type: String, required: true }
//   },
//   {
// timestamps: true
//   }     // e.g., "/uploads/purchase_orders/Purchase_Order-Item1-123.pdf"
  
// );

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);

const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    deliveryPeriod: { type: String, default: "12 weeks" }, // e.g., "2 weeks", "10 days"
    totalAmount: { type: Number, default: 0 },
    make: { type: String, default: "" },
    status: { type: String, default: "Pending" }, // Pending, Sent, Delivered
    sentDate: { type: Date }, // when marked sent
    deliveryDate: { type: Date } // expected delivery date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
