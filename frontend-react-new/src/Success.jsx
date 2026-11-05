function Success({ setPage }) {
  return (
    <div className="success-page">

      <div className="success-box">

        <div className="success-icon">🎉</div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for shopping with S MART 🛒
        </p>

        <p>
          Your order has been placed successfully.
        </p>

        <div className="success-buttons">

          <button onClick={() => setPage("orders")}>
            📦 View My Orders
          </button>

          <button onClick={() => setPage("home")}>
            🏠 Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}

export default Success;