
// const mongoose = require("mongoose");

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     filename: { type: String, required: true },
//     originalName: { type: String, required: true },
//     url: { type: String, required: true },
//     deliveryPeriod: { type: String, default: "12 weeks" }, // e.g., "2 weeks", "10 days"
//     totalAmount: { type: Number, default: 0 },
//     make: { type: String, default: "" },
//     status: { type: String, default: "Pending" }, // Pending, Sent, Delivered
//     sentDate: { type: Date }, // when marked sent
//     deliveryDate: { type: Date } // expected delivery date
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);


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
