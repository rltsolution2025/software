import React from "react";

const WelcomeDashboard = () => {
  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3>👋 Welcome to Purchase & Inventory Dashboard</h3>
        <p className="text-muted">
          Manage your purchases, compare Excel sheets, and generate reports efficiently.
        </p>

        <hr />

        <h5 className="mb-3">📌 Latest Updates</h5>

        <ul className="list-group">
          <li className="list-group-item">
            ✅ Delivery Reports – Track item delivery status and ETA.
          </li>
          <li className="list-group-item">
            📊 Monthly Reports – Download monthly reports in Excel or PDF.
          </li>
          <li className="list-group-item">
            🛒 Purchase Items – View total purchases for each month.
          </li>
          <li className="list-group-item">
            💰 Spending Overview – Track overall monthly spending.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
