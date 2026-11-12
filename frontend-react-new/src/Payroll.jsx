import { useState, useEffect } from "react";
import "./payroll.css";

function Payroll() {
  const [employee, setEmployee] = useState({
    name: "",
    employeeId: "",
    basicSalary: "",
    allowance: "",
    deduction: "",
  });

  const [salaryDetails, setSalaryDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const [payrollHistory, setPayrollHistory] = useState([]);

  // Fetch payroll records from MongoDB
  const fetchPayrollHistory = async () => {
    try {
      const response = await fetch("https://smart-supermarket-backend.onrender.com/api/payroll");

      if (!response.ok) {
        throw new Error("Failed to fetch payroll records");
      }

      const data = await response.json();
      setPayrollHistory(data);
    } catch (error) {
      console.error("Payroll history error:", error);
    }
  };

  // Load saved records when page opens
  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const calculateSalary = async (e) => {
    e.preventDefault();

    if (!employee.name || !employee.employeeId || !employee.basicSalary) {
      alert("Please fill all required details!");
      return;
    }

    const basic = Number(employee.basicSalary);
    const allowance = Number(employee.allowance || 0);
    const deduction = Number(employee.deduction || 0);

    if (basic < 0 || allowance < 0 || deduction < 0) {
      alert("Salary values cannot be negative!");
      return;
    }

    if (deduction > basic + allowance) {
      alert("Deduction cannot be greater than total salary!");
      return;
    }

    const netSalary = basic + allowance - deduction;

    const payrollData = {
      employeeName: employee.name,
      employeeId: employee.employeeId,
      basicSalary: basic,
      allowance: allowance,
      deduction: deduction,
      netSalary: netSalary,
    };

    try {
      setSaving(true);

      const response = await fetch("https://smart-supermarket-backend.onrender.com/api/payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payrollData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payroll saving failed");
      }

      setSalaryDetails({
        ...employee,
        netSalary: netSalary,
      });

      alert("Salary calculated and saved successfully! ✅");

      // Refresh payroll history
      fetchPayrollHistory();

      // Clear form
      setEmployee({
        name: "",
        employeeId: "",
        basicSalary: "",
        allowance: "",
        deduction: "",
      });
    } catch (error) {
      console.error("Payroll Error:", error);
      alert("Salary saving failed ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="payroll-page">
      <div className="payroll-container">

        {/* HEADER */}

        <div className="payroll-header">
          <div className="payroll-icon">💰</div>

          <h1>Payroll Management</h1>

          <p>Calculate and manage employee salaries</p>
        </div>

        {/* EMPLOYEE FORM */}

        <div className="payroll-card">
          <h2>👤 Employee Details</h2>

          <form onSubmit={calculateSalary} className="payroll-form">

            <label>Employee Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={employee.name}
              onChange={handleChange}
              required
            />

            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              placeholder="Enter employee ID"
              value={employee.employeeId}
              onChange={handleChange}
              required
            />

            <label>Basic Salary (₹)</label>
            <input
              type="number"
              name="basicSalary"
              placeholder="Enter basic salary"
              value={employee.basicSalary}
              onChange={handleChange}
              min="0"
              required
            />

            <label>Allowance (₹)</label>
            <input
              type="number"
              name="allowance"
              placeholder="Travel / Food / Other allowance"
              value={employee.allowance}
              onChange={handleChange}
              min="0"
            />

            <label>Deduction (₹)</label>
            <input
              type="number"
              name="deduction"
              placeholder="Leave / Advance / Other deduction"
              value={employee.deduction}
              onChange={handleChange}
              min="0"
            />

            <button
              type="submit"
              className="payroll-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "💵 Calculate & Save Salary"}
            </button>

          </form>
        </div>

        {/* LATEST SALARY */}

        {salaryDetails && (
          <div className="payroll-card salary-result">
            <h2>🧾 Latest Salary</h2>

            <p>
              <strong>Employee Name:</strong>{" "}
              {salaryDetails.name}
            </p>

            <p>
              <strong>Employee ID:</strong>{" "}
              {salaryDetails.employeeId}
            </p>

            <p>
              <strong>Basic Salary:</strong> ₹
              {salaryDetails.basicSalary}
            </p>

            <p>
              <strong>Allowance:</strong> ₹
              {salaryDetails.allowance || 0}
            </p>

            <p>
              <strong>Deduction:</strong> ₹
              {salaryDetails.deduction || 0}
            </p>

            <hr />

            <h2>
              💰 Net Salary: ₹{salaryDetails.netSalary}
            </h2>
          </div>
        )}

        {/* PAYROLL HISTORY */}

        <div className="payroll-card">
          <h2>📋 Saved Payroll History</h2>

          {payrollHistory.length === 0 ? (
            <p>No payroll records found.</p>
          ) : (
            payrollHistory.map((record) => (
              <div className="salary-history-item" key={record._id}>

                <h3>👤 {record.employeeName}</h3>

                <p>
                  <strong>Employee ID:</strong>{" "}
                  {record.employeeId}
                </p>

                <p>
                  <strong>Basic Salary:</strong> ₹
                  {record.basicSalary}
                </p>

                <p>
                  <strong>Allowance:</strong> ₹
                  {record.allowance}
                </p>

                <p>
                  <strong>Deduction:</strong> ₹
                  {record.deduction}
                </p>

                <h3>
                  💰 Net Salary: ₹{record.netSalary}
                </h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "N/A"}
                </p>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Payroll;