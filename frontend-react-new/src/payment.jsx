import { useState } from "react";
import "./products.css";

function Payment({ setPage }) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // GET LOCAL STORAGE DATA
  const getLocalData = (key, defaultValue) => {
    try {
      return JSON.parse(
        localStorage.getItem(key) || JSON.stringify(defaultValue)
      );
    } catch (error) {
      console.error(`${key} reading error:`, error);
      return defaultValue;
    }
  };

  const cart = getLocalData("cart", []);
  const checkoutData = getLocalData("checkoutData", {});

  // GET LOGGED-IN USER
  const storedUser = getLocalData("loggedInUser", {});
  const loggedInUser = storedUser.user || storedUser;

  const userId = String(
    loggedInUser.email ||
      loggedInUser._id ||
      loggedInUser.id ||
      ""
  )
    .trim()
    .toLowerCase();

  // CALCULATE TOTAL
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const itemCount = cart.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0
  );

  // SAVE LOCAL ORDER BACKUP WITHOUT QUOTA ERROR
  function saveLocalOrder(order) {
    try {
      const oldOrders = getLocalData("orders", []);
      const updatedOrders = [...oldOrders, order];

      // First try saving complete order history
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (error) {
        console.warn("Order history storage is full:", error);

        // If storage is full, keep only the latest 5 orders
        const recentOrders = updatedOrders.slice(-5);

        localStorage.setItem(
          "orders",
          JSON.stringify(recentOrders)
        );
      }

      return true;
    } catch (error) {
      console.warn("Local order backup failed:", error);
      return false;
    }
  }

  // SEND ADMIN SMS
  async function sendAdminSMS(order) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/send-order-sms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: order.customerName,
            phone: order.phone,
            total: order.total,
            itemCount: order.itemCount,
            orderId: order.id,
          }),
        }
      );

      if (!response.ok) {
        console.warn("Admin SMS request failed.");
        return;
      }

      console.log("Admin SMS request completed.");
    } catch (error) {
      console.warn("SMS service unavailable:", error.message);
    }
  }

  // PLACE ORDER
  async function placeOrder() {
    if (isPlacingOrder) return;

    if (!userId) {
      alert("Please login before placing an order 🔐");
      setPage("userLogin");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      setPage("products");
      return;
    }

    if (
      !checkoutData.customerName ||
      !checkoutData.phone ||
      !checkoutData.address
    ) {
      alert("Please enter your delivery details first.");
      setPage("checkout");
      return;
    }

    setIsPlacingOrder(true);

    const orderId = Date.now();

    const order = {
      id: orderId,
      userId,
      customerName: checkoutData.customerName,
      phone: checkoutData.phone,
      address: checkoutData.address,
      items: cart,
      total,
      itemCount,
      payment: "Cash on Delivery",
      date: new Date().toLocaleString(),
      status: "Order Placed",
    };

    try {
      // SAVE ORDER TO MONGODB
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: order.userId,
            customerName: order.customerName,
            phone: order.phone,
            address: order.address,
            total: order.total,
            payment: order.payment,
            items: order.items,
            status: order.status,
          }),
        }
      );

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Order could not be saved"
        );
      }

      console.log("MongoDB Order Saved Successfully:", data);

      // LOCAL STORAGE BACKUP
      // If this fails, the MongoDB order is still saved.
      saveLocalOrder(order);

      // SEND SMS WITHOUT BLOCKING ORDER SUCCESS
      sendAdminSMS(order);

      // CLEAR CART AND CHECKOUT DATA
      try {
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutData");
      } catch (error) {
        console.warn("Could not clear local checkout data:", error);
      }

      alert("Order saved successfully! 🎉");
      setPage("success");
    } catch (error) {
      console.error("Order placement error:", error);

      alert("Order Error: " + error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  }

  // PAYMENT UI
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <div className="payment-icon">💳</div>
          <h1>Payment</h1>
          <p>Choose your payment method</p>
        </div>

        <div className="payment-card">
          <h2>💰 Payment Method</h2>

          <div className="payment-option">
            <div className="payment-option-left">
              <div className="payment-method-icon">💵</div>

              <div>
                <h3>Cash on Delivery</h3>
                <p>Pay when your order is delivered</p>
              </div>
            </div>

            <input type="radio" checked readOnly />
          </div>

          <div className="payment-customer-details">
            <h3>👤 Delivery Details</h3>

            <p>
              <strong>Name:</strong> {checkoutData.customerName}
            </p>

            <p>
              <strong>Phone:</strong> {checkoutData.phone}
            </p>

            <p>
              <strong>Address:</strong> {checkoutData.address}
            </p>
          </div>

          <div className="payment-items">
            <h3>🛒 Order Items</h3>

            {cart.map((item, index) => {
              const quantity = Number(item.quantity || 1);
              const unit = item.unit || "piece";
              const itemTotal = Number(item.price || 0) * quantity;

              return (
                <div
                  className="payment-item"
                  key={`${item.id || item.name}-${index}`}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {quantity} {unit} × ₹{item.price}
                    </p>
                  </div>

                  <strong>₹{itemTotal}</strong>
                </div>
              );
            })}
          </div>

          <div className="payment-total">
            <span>Order Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder
              ? "⏳ Placing Order..."
              : "🛍️ Place Order"}
          </button>

          <button
            className="payment-back-btn"
            onClick={() => setPage("checkout")}
            disabled={isPlacingOrder}
          >
            ← Back to Checkout
          </button>
        </div>

        <p className="payment-security">
          🔒 Your order details are securely saved
        </p>
      </div>
    </div>
  );
}

export default Payment;