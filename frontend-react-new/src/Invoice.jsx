import React from "react";
import "./invoice.css";

function Invoice() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const latestOrder = orders[orders.length - 1];

  if (!latestOrder) {
    return (
      <div className="invoice-container">
        <div className="invoice-card">
          <h2>🧾 No Invoice Available</h2>
          <p>Please place an order first to generate an invoice.</p>
        </div>
      </div>
    );
  }

  const items = latestOrder.items || [];

  return (
    <div className="invoice-container">
      <div className="invoice-card">

        {/* Invoice Header */}
        <div className="invoice-header">
          <h1>🛒 S MART</h1>
          <h2>Customer Invoice</h2>
          <p>Smart Supermarket Management System</p>
        </div>

        <hr />

        {/* Customer Details */}
        <div className="invoice-section">
          <h3>👤 Customer Details</h3>

          <p>
            <strong>Name:</strong>{" "}
            {latestOrder.customerName || "Customer"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {latestOrder.phone || "Not available"}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {latestOrder.address || "Not available"}
          </p>
        </div>

        <hr />

        {/* Order Details */}
        <div className="invoice-section">
          <h3>📦 Order Details</h3>

          <p>
            <strong>Order ID:</strong>{" "}
            {latestOrder.id || latestOrder._id || "N/A"}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {latestOrder.date || "Not available"}
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {latestOrder.payment || "Cash on Delivery"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {latestOrder.status || "Order Placed"}
          </p>
        </div>

        <hr />

        {/* Product Details */}
        <div className="invoice-section">
          <h3>🛍️ Product Details</h3>

          <div className="invoice-table">
            <div className="table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Amount</span>
            </div>

            {items.map((item, index) => {
              const quantity = Number(item.quantity) || 1;
              const price = Number(item.price) || 0;
              const amount = price * quantity;

              return (
                <div className="table-row" key={index}>
                  <span>{item.name}</span>
                  <span>₹{price}</span>
                  <span>{quantity}</span>
                  <span>₹{amount}</span>
                </div>
              );
            })}
          </div>
        </div>

        <hr />

        {/* Total Amount */}
        <div className="invoice-total">
          <h2>
            Total Amount: ₹{latestOrder.total || 0}
          </h2>
        </div>

        <div className="success-message">
          ✅ Thank you for shopping with S MART!
        </div>

        {/* Buttons */}
        <div className="invoice-buttons">
          <button onClick={() => window.print()}>
            🖨️ Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
}

export default Invoice;