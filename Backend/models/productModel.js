const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: "Standard",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "Grocery",
    },
    unit: {
      type: String,
      default: "piece",
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);