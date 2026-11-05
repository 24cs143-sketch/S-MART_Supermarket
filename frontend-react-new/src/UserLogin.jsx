import { useState } from "react";

function UserLogin({ setPage, onUserLogin }) {
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
        setMessage(data.message || "Invalid email or password ❌");
        setIsSuccess(false);
        setShowMessage(true);
        return;
      }

      // Save login status and user details
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      // Keep currentUser also for compatibility
      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      setMessage("Login successful! 🎉");
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
      onUserLogin();
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🔐</div>

        <h1>User Login</h1>

        <p className="login-subtitle">
          Login to continue shopping in S MART
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>📧 Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>🔒 Password</label>

            <input
              type="password"
              placeholder="Enter your password"
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
            {loading ? "Logging in..." : "🔐 Login"}
          </button>
        </form>

        <p className="login-link-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="go-login-button"
          onClick={() => setPage("register")}
        >
          ✨ Create Account
        </button>

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

export default UserLogin;