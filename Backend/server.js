require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const smsRoutes = require("./routes/smsRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const payLaterRoutes = require("./routes/payLaterRoutes");

const app = express();

// Connect MongoDB Atlas
connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Product API
app.use("/api/products", productRoutes);

// Authentication API
app.use("/api/auth", authRoutes);

// Orders API
app.use("/api/orders", orderRoutes);

// Payroll API
app.use("/api/payroll", payrollRoutes);

// Pay Later API
app.use("/api/paylater", payLaterRoutes);

// SMS API
app.use("/api", smsRoutes);

console.log("AUTH ROUTE ACTIVE");

app.get("/", (req, res) => {
  res.send("S MART Backend is Running! 🛒");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`S MART Backend running on http://localhost:${PORT}`);
});