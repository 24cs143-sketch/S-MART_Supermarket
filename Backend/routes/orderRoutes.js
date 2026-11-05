const express = require("express");
const Order = require("../models/orderModel");

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);

    res.status(201).json({
      message: "Order saved successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order saving failed",
      error: error.message,
    });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Orders fetching failed",
      error: error.message,
    });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
      error: error.message,
    });
  }
});
// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Order deletion failed",
      error: error.message,
    });
  }
});

module.exports = router;