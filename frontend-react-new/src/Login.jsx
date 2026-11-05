import { useState } from "react";

function Login({ setPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [success, setSuccess] = useState(false);

  function showMessage(text, isSuccess = false) {
    setMessage(text);
    setSuccess(isSuccess);
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
  }

  async function handleLogin(e) {
  e.preventDefault();

  if (!email.trim() || !password) {
    showMessage("Please enter email and password ❌");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Login failed ❌");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(data.user)
    );

    showMessage("Login successful! 🎉", true);
  } catch (error) {
    showMessage("Backend connection failed ❌");
  }
}
  function handleSuccess() {
    setShowPopup(false);
    setEmail("");
    setPassword("");

    if (onLogin) {
      onLogin();
    } else {
      setPage("home");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🛒</div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to continue shopping with
          <strong> S MART</strong>
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>📧 Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>🔒 Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            🔐 Login
          </button>
        </form>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="register-button"
          onClick={() => setPage("register")}
        >
          ✨ Create New Account
        </button>

        <button
          type="button"
          className="back-home"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-icon">
              {success ? "✅" : "❌"}
            </div>

            <h2>
              {success ? "Success" : "Login Failed"}
            </h2>

            <p>{message}</p>

            {success ? (
              <button
                className="popup-ok-btn"
                onClick={handleSuccess}
              >
                OK
              </button>
            ) : (
              <button
                className="popup-cancel-btn"
                onClick={closePopup}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;