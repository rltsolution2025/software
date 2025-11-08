import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PurchaseOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No purchase order data found.</p>;

  const { company, item, specs } = state;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>← Back</button>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src={company.logo}
          alt="Company Logo"
          style={{ width: "120px", height: "120px", objectFit: "contain" }}
        />
        <div>
          <h2>{company.name}</h2>
          <p>{company.address}</p>
          <p><strong>Telephone:</strong> {company.phone}</p>
          <p><strong>GST:</strong> {company.gst}</p>
          <p><strong>CIN:</strong> {company.cin}</p>
        </div>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Purchase Order for: {item}</h3>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th>Specification</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((s, idx) => (
            <tr key={idx}>
              <td><strong>{s.name}</strong></td>
              <td>{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "40px", textAlign: "center" }}>
        <em>Thank you for choosing RL Technologies.</em>
      </p>
    </div>
  );
};

export default PurchaseOrder;
