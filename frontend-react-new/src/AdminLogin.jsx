import { useState } from "react";

function AdminLogin({ setPage, onAdminLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password) {
      setMessage("Please enter email and password ❌");
      setIsSuccess(false);
      setShowMessage(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage("Invalid admin email or password ❌");
        setIsSuccess(false);
        setShowMessage(true);
        return;
      }

      if (data.user.role !== "Admin") {
        setMessage("You are not an admin ❌");
        setIsSuccess(false);
        setShowMessage(true);
        return;
      }

      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem(
        "loggedInAdmin",
        JSON.stringify(data.user)
      );

      setMessage("Admin login successful! 🎉");
      setIsSuccess(true);
      setShowMessage(true);
    } catch (error) {
      setMessage("Backend server is not connected ❌");
      setIsSuccess(false);
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  }

  function handleOK() {
    setShowMessage(false);

    if (isSuccess) {
      onAdminLogin();
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🧑‍💼</div>

        <h1>Admin Login</h1>

        <p className="login-subtitle">
          Login to manage S MART
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>📧 Admin Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>🔒 Admin Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔐 Admin Login"}
          </button>
        </form>

        <button
          type="button"
          className="back-home"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>
      </div>

      {showMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-icon">
              {isSuccess ? "✅" : "❌"}
            </div>

            <p>{message}</p>

            <button
              className={
                isSuccess
                  ? "popup-ok-btn"
                  : "popup-cancel-btn"
              }
              onClick={handleOK}
            >
              {isSuccess ? "OK" : "Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;