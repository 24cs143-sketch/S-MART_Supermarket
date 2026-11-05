import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= GET LOGGED-IN USER =================

  const getLoggedInUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );
    } catch (error) {
      console.error("User data reading error:", error);
      return {};
    }
  };

  const loggedInUser = getLoggedInUser();

  // Create multiple user identifiers
  const userIdentifiers = [
    loggedInUser._id,
    loggedInUser.id,
    loggedInUser.email,
    loggedInUser.phone,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase());

  // ================= FETCH ORDERS =================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        console.log("Logged-in User:", loggedInUser);
        console.log("User Identifiers:", userIdentifiers);
        console.log("Fetched Orders from MongoDB:", data);

        // ================= FILTER USER ORDERS =================

        console.log("All Orders:",data);
      

        setOrders(data);
      } catch (error) {
        console.error("Orders fetching error:", error);
        setError("Unable to load your orders from MongoDB");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <h2>⏳ Loading Orders...</h2>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className="orders-page">
      {/* ================= HEADER ================= */}

      <div className="orders-title">
        <h1>📦 My Orders</h1>

        <p>View your previous orders and order details</p>

        {error && (
          <p style={{ color: "orange" }}>
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* ================= EMPTY ORDERS ================= */}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>

          <h2>No Orders Yet</h2>

          <p>Your placed orders will appear here.</p>

          <p style={{ color: "#777", fontSize: "13px" }}>
            Please place an order using this account.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders
            .slice()
            .reverse()
            .map((order, index) => {
              const orderId =
                order._id || order.id || index;

              const orderDate =
                order.date ||
                (order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString()
                  : "Date not available");

              const orderedItems = Array.isArray(order.items)
                ? order.items
                : [];

              const totalItems = orderedItems.reduce(
                (total, item) =>
                  total + Number(item.quantity || 1),
                0
              );

              return (
                <div
                  className="order-card"
                  key={orderId}
                >
                  {/* ================= ORDER HEADER ================= */}

                  <div className="order-header">
                    <div>
                      <h2>
                        📦 Order #{orders.length - index}
                      </h2>

                      <p>
                        Order ID:{" "}
                        {order._id || order.id || "N/A"}
                      </p>
                    </div>

                    <span className="order-status">
                      {order.status || "Order Placed"}
                    </span>
                  </div>

                  {/* ================= DATE ================= */}

                  <div className="order-date">
                    📅 {orderDate}
                  </div>

                  {/* ================= CUSTOMER DETAILS ================= */}

                  <div className="order-customer">
                    <h3>👤 Customer Details</h3>

                    <div className="customer-grid">
                      <p>
                        <strong>Name</strong>
                        <br />
                        {order.customerName || "Customer"}
                      </p>

                      <p>
                        <strong>Phone</strong>
                        <br />
                        {order.phone || "Not provided"}
                      </p>

                      <p className="customer-address">
                        <strong>Address</strong>
                        <br />
                        {order.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* ================= ORDERED PRODUCTS ================= */}

                  <div className="ordered-products">
                    <h3>🛒 Ordered Items</h3>

                    {orderedItems.length === 0 ? (
                      <p>No product details available.</p>
                    ) : (
                      orderedItems.map(
                        (product, itemIndex) => {
                          const quantity = Number(
                            product.quantity || 1
                          );

                          const unit =
                            product.unit || "piece";

                          const itemTotal =
                            Number(product.price || 0) *
                            quantity;

                          return (
                            <div
                              className="ordered-product"
                              key={`${
                                product.id ||
                                product._id ||
                                product.name
                              }-${itemIndex}`}
                            >
                              <div className="ordered-product-image">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div>🛍️</div>
                                )}
                              </div>

                              <div className="ordered-product-details">
                                <h4>
                                  {product.name ||
                                    "Product"}
                                </h4>

                                <p>
                                  {product.category ||
                                    "General"}
                                </p>

                                <span>
                                  ₹{product.price || 0} /{" "}
                                  {unit}
                                </span>
                              </div>

                              <div className="ordered-product-quantity">
                                <strong>
                                  × {quantity}
                                </strong>

                                <small>{unit}</small>
                              </div>

                              <div className="ordered-product-total">
                                ₹{itemTotal}
                              </div>
                            </div>
                          );
                        }
                      )
                    )}
                  </div>

                  {/* ================= ORDER SUMMARY ================= */}

                  <div className="order-summary">
                    <div className="summary-line">
                      <span>🛒 Total Items</span>

                      <strong>{totalItems}</strong>
                    </div>

                    <div className="summary-line">
                      <span>💵 Payment</span>

                      <strong>
                        {order.payment ||
                          "Cash on Delivery"}
                      </strong>
                    </div>

                    <div className="summary-total">
                      <span>Grand Total</span>

                      <strong>₹{order.total || 0}</strong>
                    </div>
                  </div>

                  {/* ================= ORDER STATUS ================= */}

                  <div className="order-bottom">
                    <span>📌 Status:</span>

                    <strong>
                      {order.status || "Order Placed"}
                    </strong>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Orders;