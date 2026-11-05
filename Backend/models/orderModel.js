const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    payment: {
      type: String,
      default: "Cash on Delivery",
    },

    items: {
      type: Array,
      required: true,
    },

    status: {
      type: String,
      default: "Order Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);