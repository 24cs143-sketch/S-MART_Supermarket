const express = require("express");
const PayLater = require("../models/payLaterModel");

const router = express.Router();

// Save new due
router.post("/", async (req, res) => {
  try {
    const due = await PayLater.create(req.body);
    res.status(201).json({
      message: "Due saved successfully",
      due,
    });
  } catch (error) {
    res.status(400).json({
      message: "Due saving failed",
      error: error.message,
    });
  }
});

// Get all dues
router.get("/", async (req, res) => {
  try {
    const dues = await PayLater.find().sort({ createdAt: -1 });
    res.status(200).json(dues);
  } catch (error) {
    res.status(500).json({
      message: "Due fetching failed",
      error: error.message,
    });
  }
});

// Mark due as paid
router.patch("/:id", async (req, res) => {
  try {
    const due = await PayLater.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true, runValidators: true }
    );

    if (!due) {
      return res.status(404).json({ message: "Due not found" });
    }

    res.json({ message: "Payment marked as Paid", due });
  } catch (error) {
    res.status(400).json({
      message: "Payment update failed",
      error: error.message,
    });
  }
});

// Delete due
router.delete("/:id", async (req, res) => {
  try {
    const due = await PayLater.findByIdAndDelete(req.params.id);

    if (!due) {
      return res.status(404).json({ message: "Due not found" });
    }

    res.json({ message: "Due deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Due deletion failed",
      error: error.message,
    });
  }
});

module.exports = router;