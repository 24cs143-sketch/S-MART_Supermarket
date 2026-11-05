function Admin({ setPage, onLogout }) {
  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}

      <div className="admin-header">
        <div>
          <h1>🧑‍💼 Admin Dashboard</h1>

          <p>
            Welcome to S MART Admin Panel
          </p>
        </div>

        {/* LOGOUT */}

        <button
          className="admin-logout-btn"
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </div>

      {/* ================= ADMIN MENU ================= */}

      <div className="admin-menu">

        {/* MANAGE PRODUCTS */}

        <div className="admin-card">
          <h2>🛍️ Manage Products</h2>

          <p>
            Add, edit and delete supermarket products.
          </p>

          <button
            onClick={() => setPage("adminProducts")}
          >
            🛍️ Manage Products
          </button>
        </div>

        {/* MANAGE ORDERS */}

        <div className="admin-card">
          <h2>📦 Manage Orders</h2>

          <p>
            View customer orders and manage order status.
          </p>

          <button
            onClick={() => setPage("adminOrders")}
          >
            📦 Manage Orders
          </button>
        </div>

        {/* INVENTORY */}

        <div className="admin-card">
          <h2>📊 Inventory Management</h2>

          <p>
            Monitor stock, low stock and out of stock products.
          </p>

          <button
            onClick={() => setPage("inventory")}
          >
            📊 View Inventory
          </button>
        </div>

        {/* PAYROLL MANAGEMENT */}

        <div className="admin-card">
          <h2>💰 Payroll Management</h2>

          <p>
            Manage employee salaries, allowances and deductions.
          </p>

          <button
            onClick={() => setPage("payroll")}
          >
            💰 Manage Payroll
          </button>
        </div>

        {/* PAY LATER MANAGEMENT */}

        <div className="admin-card">
          <h2>💳 Pay Later Management</h2>

          <p>
            Manage customer credit, due amounts and payment status.
          </p>

          <button
            onClick={() => setPage("paylater")}
          >
            💳 Manage Pay Later
          </button>
        </div>

      </div>

      {/* ================= BACK HOME ================= */}

      <button
        className="admin-home-btn"
        onClick={() => setPage("home")}
      >
        🏠 Back to Home
      </button>

    </div>
  );
}

export default Admin;