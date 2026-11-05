import React, { useEffect, useState } from "react";
import "./paylater.css";

const API_URL = "http://localhost:5000/api/paylater";

function PayLater() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Load dues from MongoDB
  const fetchDues = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch dues");
      }

      const data = await response.json();
      setDues(data);
    } catch (error) {
      console.error("Fetch dues error:", error);
      alert("Unable to load dues. Please check the backend!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDues();
  }, []);

  // Save new due to MongoDB
  const saveDue = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !amount || !dueDate) {
      alert("Please fill all fields ❗");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Due amount must be greater than zero ❗");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          amount: Number(amount),
          dueDate,
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Due saving failed");
      }

      setDues((previousDues) => [data.due, ...previousDues]);

      setCustomerName("");
      setPhone("");
      setAmount("");
      setDueDate("");

      alert("Pay Later details saved successfully! ✅");
    } catch (error) {
      console.error("Save due error:", error);
      alert(error.message || "Unable to save due. Please try again!");
    }
  };

  // Mark payment as paid in MongoDB
  const markAsPaid = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment update failed");
      }

      setDues((previousDues) =>
        previousDues.map((due) =>
          due._id === id ? data.due : due
        )
      );

      alert("Payment marked as Paid ✅");
    } catch (error) {
      console.error("Mark as paid error:", error);
      alert(error.message || "Unable to update payment!");
    }
  };

  // Delete due from MongoDB
  const deleteDue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this due?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Due deletion failed");
      }

      setDues((previousDues) =>
        previousDues.filter((due) => due._id !== id)
      );

      alert("Due deleted successfully 🗑️");
    } catch (error) {
      console.error("Delete due error:", error);
      alert(error.message || "Unable to delete due!");
    }
  };

  // Calculate current status
  const getDueStatus = (due) => {
    if (due.status === "Paid") {
      return "Paid";
    }

    if (due.dueDate < getTodayDate()) {
      return "Overdue";
    }

    return "Pending";
  };

  return (
    <div className="paylater-container">
      {/* PAY LATER FORM */}
      <div className="paylater-card">
        <h1>💳 Pay Later Management</h1>
        <p>Manage customer credit and due payments</p>

        <form onSubmit={saveDue}>
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Customer Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="number"
            placeholder="Due Amount ₹"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button type="submit">
            ➕ Save Due
          </button>
        </form>
      </div>

      {/* CUSTOMER DUE HISTORY */}
      <div className="due-list">
        <h2>📋 Customer Due History</h2>

        {loading ? (
          <p className="empty-message">Loading due payments...</p>
        ) : dues.length === 0 ? (
          <p className="empty-message">
            No due payments available.
          </p>
        ) : (
          dues.map((due) => {
            const currentStatus = getDueStatus(due);

            return (
              <div className="due-item" key={due._id}>
                <h3>👤 {due.customerName}</h3>

                <p>
                  <strong>Phone:</strong> {due.phone}
                </p>

                <p>
                  <strong>Due Amount:</strong> ₹{due.amount}
                </p>

                <p>
                  <strong>Due Date:</strong> {due.dueDate}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      currentStatus === "Paid"
                        ? "paid-status"
                        : currentStatus === "Overdue"
                        ? "overdue-status"
                        : "pending-status"
                    }
                  >
                    {currentStatus}
                  </span>
                </p>

                {currentStatus !== "Paid" && (
                  <button
                    className="paid-button"
                    onClick={() => markAsPaid(due._id)}
                  >
                    ✅ Mark as Paid
                  </button>
                )}

                <button
                  className="delete-due-button"
                  onClick={() => deleteDue(due._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PayLater;