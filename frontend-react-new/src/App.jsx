import { useState } from "react";

import Home from "./Home";
import Products from "./products";
import Cart from "./cart";
import Checkout from "./checkout";
import Payment from "./payment";
import Success from "./Success";
import Orders from "./orders";

import UserLogin from "./UserLogin";
import Register from "./Register";

import AdminLogin from "./AdminLogin";
import Admin from "./Admin";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import Inventory from "./Inventory";
import Payroll from "./Payroll";
import Invoice from "./Invoice";
import PayLater from "./PayLater";

import "./App.css";

function App() {
  // ================= PAGE =================

  const [page, setPage] = useState("home");

  // ================= USER LOGIN STATUS =================

  const [userLoggedIn, setUserLoggedIn] = useState(
    localStorage.getItem("userLoggedIn") === "true"
  );

  // ================= CURRENT USER =================

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // ================= ADMIN LOGIN STATUS =================

  const [adminLoggedIn, setAdminLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn") === "true"
  );

  // ================= USER LOGIN =================

  const handleUserLogin = () => {
    const savedUser = localStorage.getItem("loggedInUser");

    setUserLoggedIn(true);

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        setCurrentUser(null);
      }
    }

    localStorage.setItem("userLoggedIn", "true");
    setPage("home");
  };

  // ================= USER LOGOUT =================

  const handleUserLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("currentUser");

    setUserLoggedIn(false);
    setCurrentUser(null);
    setPage("userLogin");
  };

  // ================= PROTECTED USER PAGE =================

  const openUserPage = (targetPage) => {
    if (!userLoggedIn) {
      alert("Please login first 🔐");
      setPage("userLogin");
      return;
    }

    setPage(targetPage);
  };

  // ================= ADMIN LOGIN =================

  const handleAdminLogin = () => {
    setAdminLoggedIn(true);
    localStorage.setItem("adminLoggedIn", "true");
    setPage("admin");
  };

  // ================= ADMIN LOGOUT =================

  const handleAdminLogout = () => {
    localStorage.removeItem("adminLoggedIn");

    setAdminLoggedIn(false);
    setPage("adminLogin");
  };

  // ================= NORMAL PAGE ORDER =================

  const pages = [
    "home",
    "products",
    "cart",
    "checkout",
    "payment",
    "orders",
  ];

  const currentIndex = pages.indexOf(page);

  // ================= BACK =================

  const handleBack = () => {
    if (currentIndex > 0) {
      setPage(pages[currentIndex - 1]);
    }
  };

  // ================= NEXT =================

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < pages.length - 1) {
      const nextPage = pages[currentIndex + 1];

      if (
        (nextPage === "checkout" ||
          nextPage === "payment" ||
          nextPage === "orders") &&
        !userLoggedIn
      ) {
        alert("Please login first 🔐");
        setPage("userLogin");
        return;
      }

      setPage(nextPage);
    }
  };

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        {/* LOGO */}

        <div className="logo" onClick={() => setPage("home")}>
          🛒 <span>S MART</span>
        </div>

        {/* NAVIGATION */}

        <div className="nav-links">
          {/* HOME */}

          <button
            className={page === "home" ? "active" : ""}
            onClick={() => setPage("home")}
          >
            🏠 Home
          </button>

          {/* PRODUCTS */}

          <button
            className={page === "products" ? "active" : ""}
            onClick={() => setPage("products")}
          >
            🛍️ Products
          </button>

          {/* CART */}

          <button
            className={page === "cart" ? "active" : ""}
            onClick={() => setPage("cart")}
          >
            🛒 Cart
          </button>

          {/* CHECKOUT */}

          <button
            className={page === "checkout" ? "active" : ""}
            onClick={() => openUserPage("checkout")}
          >
            🧾 Checkout
          </button>

          {/* PAYMENT */}

          <button
            className={page === "payment" ? "active" : ""}
            onClick={() => openUserPage("payment")}
          >
            💳 Payment
          </button>

          {/* MY ORDERS */}

          <button
            className={page === "orders" ? "active" : ""}
            onClick={() => openUserPage("orders")}
          >
            📦 My Orders
          </button>

          {/* INVOICE */}

          <button
            className={page === "invoice" ? "active" : ""}
            onClick={() => openUserPage("invoice")}
          >
            🧾 Invoice
          </button>

          {/* USER LOGIN / LOGOUT */}

          {!userLoggedIn ? (
            <button
              className={page === "userLogin" ? "active" : ""}
              onClick={() => setPage("userLogin")}
            >
              🔐 Login
            </button>
          ) : (
            <>
              <span className="welcome-user">
                👋 Hi, {currentUser?.name || "User"}
              </span>

              <button
                className="logout-nav-btn"
                onClick={handleUserLogout}
              >
                🚪 Logout
              </button>
            </>
          )}

          {/* ADMIN */}

          <button
            className={
              page === "admin" || page === "adminLogin"
                ? "active"
                : ""
            }
            onClick={() => {
              if (adminLoggedIn) {
                setPage("admin");
              } else {
                setPage("adminLogin");
              }
            }}
          >
            ⚙️ Admin
          </button>
        </div>
      </nav>

      {/* ================= PAGE CONTENT ================= */}

      <main>
        {/* HOME */}

        {page === "home" && <Home setPage={setPage} />}

        {/* PRODUCTS */}

        {page === "products" && <Products setPage={setPage} />}

        {/* CART */}

        {page === "cart" && <Cart setPage={setPage} />}

        {/* CHECKOUT */}

        {page === "checkout" && userLoggedIn && (
          <Checkout setPage={setPage} />
        )}

        {/* PAYMENT */}

        {page === "payment" && userLoggedIn && (
          <Payment setPage={setPage} />
        )}

        {/* SUCCESS */}

        {page === "success" && <Success setPage={setPage} />}

        {/* ORDERS */}

        {page === "orders" && userLoggedIn && (
          <Orders setPage={setPage} />
        )}

        {/* USER LOGIN */}

        {page === "userLogin" && (
          <UserLogin
            setPage={setPage}
            onUserLogin={handleUserLogin}
          />
        )}

        {/* REGISTER */}

        {page === "register" && <Register setPage={setPage} />}

        {/* ADMIN LOGIN */}

        {page === "adminLogin" && (
          <AdminLogin
            setPage={setPage}
            onAdminLogin={handleAdminLogin}
          />
        )}

        {/* ADMIN DASHBOARD */}

        {page === "admin" && adminLoggedIn && (
          <Admin
            setPage={setPage}
            onLogout={handleAdminLogout}
          />
        )}

        {/* ADMIN PRODUCTS */}

        {page === "adminProducts" && adminLoggedIn && (
          <AdminProducts setPage={setPage} />
        )}

        {/* ADMIN ORDERS */}

        {page === "adminOrders" && adminLoggedIn && (
          <AdminOrders setPage={setPage} />
        )}

        {/* INVENTORY */}

        {page === "inventory" && adminLoggedIn && (
          <Inventory setPage={setPage} />
        )}

        {/* PAYROLL */}

        {page === "payroll" && adminLoggedIn && <Payroll />}

        {/* INVOICE */}

        {page === "invoice" && userLoggedIn && <Invoice />}

        {/* PAY LATER */}

        {page === "paylater" && adminLoggedIn && (<PayLater />
      )}
      </main>

      {/* ================= BACK / NEXT ================= */}

      {!page.startsWith("admin") &&
        page !== "inventory" &&
        page !== "payroll" &&
        page !== "paylater" &&
        page !== "invoice" &&
        page !== "success" &&
        page !== "userLogin" &&
        page !== "register" && (
          <div className="page-navigation">
            {/* BACK */}

            <button
              className="back-btn"
              onClick={handleBack}
              disabled={currentIndex <= 0}
            >
              ← Back
            </button>

            {/* CURRENT PAGE */}

            <span className="page-name">
              {page === "home" && "🏠 Home"}
              {page === "products" && "🛍️ Products"}
              {page === "cart" && "🛒 Cart"}
              {page === "checkout" && "🧾 Checkout"}
              {page === "payment" && "💳 Payment"}
              {page === "orders" && "📦 My Orders"}
            </span>

            {/* NEXT */}

            <button
              className="next-btn"
              onClick={handleNext}
              disabled={
                currentIndex < 0 ||
                currentIndex >= pages.length - 1
              }
            >
              Next →
            </button>
          </div>
        )}
    </div>
  );
}

export default App;