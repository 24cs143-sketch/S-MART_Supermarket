const express = require("express");
const Payroll = require("../models/payrollModel");

const router = express.Router();

// Save payroll
router.post("/", async (req, res) => {
  try {
    const payroll = await Payroll.create(req.body);

    res.status(201).json({
      message: "Payroll saved successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payroll saving failed",
      error: error.message,
    });
  }
});

// Get all payroll records
router.get("/", async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });

    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({
      message: "Payroll fetching failed",
      error: error.message,
    });
  }
});

module.exports = router;