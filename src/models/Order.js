const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        jewelryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Jewelry",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "bank_transfer", "cash"],
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    notes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
