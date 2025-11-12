const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },

    deliveryPeriod: { type: String, default: "12 weeks" }, 
    totalAmount: { type: Number, default: 0 },
    make: { type: String, default: "" },

    // ✅ Sender details
    senderEmail: { type: String, default: "" },
    senderPhone: { type: String, default: "" },

    // ✅ Status tracking
    status: {
      type: String,
      enum: ["Pending", "Sent", "Delivered"],
      default: "Pending"
    },

    // ✅ Dates
    sentDate: { type: Date },       
    deliveryDate: { type: Date },    
    receivedDate: { type: Date }     
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
