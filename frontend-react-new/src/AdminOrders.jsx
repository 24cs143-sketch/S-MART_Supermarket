import { useState, useEffect } from "react";

function AdminOrders({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD ORDERS FROM MONGODB
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://smart-supermarket-backend.onrender.com/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("MongoDB orders loading failed:", error);
        alert("Unable to load orders from database ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // DELETE ORDER FROM MONGODB
  async function deleteOrder(orderId) {
    if (!orderId) {
      alert("Order ID not found ❌");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://smart-supermarket-backend.onrender.com/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      alert("Order deleted successfully! 🗑️");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete order ❌");
    }
  }

  // UPDATE ORDER STATUS IN MONGODB
  async function updateStatus(orderId, newStatus) {
    if (!orderId) {
      alert("Order ID not found ❌");
      return;
    }

    try {
      const response = await fetch(
        `https://smart-supermarket-backend.onrender.com/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      alert("Order status updated successfully! ✅");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update order status ❌");
    }
  }

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="admin-orders-page">
        <h2>Loading orders... ⏳</h2>
      </div>
    );
  }

  // STATISTICS
  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalItems = orders.reduce((total, order) => {
    const items = Array.isArray(order.items) ? order.items : [];

    return (
      total +
      items.reduce(
        (itemTotal, item) =>
          itemTotal + Number(item.quantity || 1),
        0
      )
    );
  }, 0);

  return (
    <div className="admin-orders-page">
      {/* HEADER */}
      <div className="admin-orders-header">
        <div>
          <h1>📦 Manage Orders</h1>
          <p>View and manage customer orders</p>
        </div>

        <button
          className="back-admin-btn"
          onClick={() => setPage("admin")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* STATISTICS */}
      <div className="admin-order-stats">
        <div className="admin-stat-card">
          <h3>📦 Total Orders</h3>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>💰 Total Sales</h3>
          <strong>₹{totalSales}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>🛒 Items Sold</h3>
          <strong>{totalItems}</strong>
        </div>

        <div className="admin-stat-card">
          <h3>💵 Payment</h3>
          <strong>COD</strong>
        </div>
      </div>

      {/* NO ORDERS */}
      {orders.length === 0 ? (
        <div className="admin-no-orders">
          <div className="admin-no-orders-icon">📦</div>

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here after an order is placed.
          </p>

          <button onClick={() => setPage("products")}>
            🛍️ Go to Products
          </button>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order, index) => {
            const items = Array.isArray(order.items)
              ? order.items
              : [];

            const orderTotal = Number(order.total || 0);

            const orderDate = order.date
              ? order.date
              : order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "N/A";

            return (
              <div
                className="admin-order-card"
                key={order._id}
              >
                {/* ORDER HEADER */}
                <div className="admin-order-card-header">
                  <div>
                    <h2>📦 Order #{index + 1}</h2>

                    <p>
                      Order ID: {order._id || "N/A"}
                    </p>

                    <p>📅 {orderDate}</p>
                  </div>

                  {/* STATUS */}
                  <div className="order-status-section">
                    <label>Order Status</label>

                    <select
                      value={order.status || "Order Placed"}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Order Placed">
                        Order Placed
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Packed">
                        Packed
                      </option>

                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="admin-order-customer">
                  <h3>👤 Customer Details</h3>

                  <div className="customer-info">
                    <p>
                      <strong>Name:</strong>{" "}
                      {order.customerName || "Customer"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.phone || "Not provided"}
                    </p>

                    <p>
                      <strong>Address:</strong>{" "}
                      {order.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* ORDERED PRODUCTS */}
                <div className="admin-ordered-products">
                  <h3>🛒 Ordered Products</h3>

                  {items.length === 0 ? (
                    <p>No product details available.</p>
                  ) : (
                    items.map((item, itemIndex) => {
                      const quantity = Number(item.quantity || 1);
                      const price = Number(item.price || 0);
                      const itemTotal = price * quantity;
                      const unit = item.unit || "piece";

                      return (
                        <div
                          className="admin-ordered-item"
                          key={`${order._id}-${item.id || itemIndex}`}
                        >
                          <div className="admin-ordered-image">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product"}
                              />
                            ) : (
                              <div className="admin-no-product-image">
                                🛍️
                              </div>
                            )}
                          </div>

                          <div className="admin-ordered-details">
                            <h4>{item.name || "Product"}</h4>

                            <p>
                              Category: {item.category || "General"}
                            </p>

                            <p>
                              ₹{price} / {unit}
                            </p>

                            <p>
                              Quantity:{" "}
                              <strong>
                                {quantity} {unit}
                              </strong>
                            </p>
                          </div>

                          <div className="admin-item-total">
                            <strong>₹{itemTotal}</strong>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* ORDER SUMMARY */}
                <div className="admin-order-summary">
                  <div>
                    <span>🛒 Total Items</span>

                    <strong>
                      {items.reduce(
                        (total, item) =>
                          total + Number(item.quantity || 1),
                        0
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>💰 Total Amount</span>
                    <strong>₹{orderTotal}</strong>
                  </div>

                  <div>
                    <span>💵 Payment</span>

                    <strong>
                      {order.payment || "Cash on Delivery"}
                    </strong>
                  </div>

                  <div>
                    <span>📅 Order Date</span>
                    <strong>{orderDate}</strong>
                  </div>
                </div>

                {/* CURRENT STATUS */}
                <div className="admin-order-status-display">
                  <span>📌 Current Status:</span>

                  <strong>
                    {order.status || "Order Placed"}
                  </strong>
                </div>

                {/* DELETE ACTION */}
                <div className="admin-order-actions">
                  <button
                    className="delete-order-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    🗑️ Delete Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;