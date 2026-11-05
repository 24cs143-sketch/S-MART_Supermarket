const express = require("express");

const router = express.Router();

// SMS route - temporary test
router.post("/send-order-sms", (req, res) => {
  const {
    customerName,
    phone,
    total,
    itemCount,
    orderId,
  } = req.body;

  console.log("📱 SMS Request Received");
  console.log("Customer:", customerName);
  console.log("Phone:", phone);
  console.log("Total:", total);
  console.log("Items:", itemCount);
  console.log("Order ID:", orderId);

  res.status(200).json({
    message: "SMS request received successfully",
  });
});

module.exports = router;