import { useState } from "react";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all details ⚠️");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number 📱");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters 🔒");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://smart-supermarket-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password: password,
            role: "Customer",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed ❌");
        return;
      }

      alert("Account created successfully! 🎉");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

      setPage("userLogin");
    } catch (error) {
      alert("Backend server is not connected ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">🛒</div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join S MART and start shopping easily
        </p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>👤 Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>📱 Phone Number</label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              required
            />
          </div>

          <div className="input-group">
            <label>🔒 Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>🔐 Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "✨ Create Account"}
          </button>
        </form>

        <p className="login-link-text">
          Already have an account?
        </p>

        <button
          type="button"
          className="go-login-button"
          onClick={() => setPage("userLogin")}
        >
          🔐 Login
        </button>

        <button
          type="button"
          className="back-home"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Register;