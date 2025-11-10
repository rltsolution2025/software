import React from "react";

const SavedPurchaseOrders = ({ savedOrders }) => {
  return (
    <div>
      <h3>Saved Purchase Orders</h3>

      {savedOrders.length === 0 ? (
        <p>No saved purchase orders yet.</p>
      ) : (
        savedOrders.map((file, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "6px",
            }}
          >
            <span>{file.originalName || file.name}</span>
            <a
              href={`http://localhost:5000${file.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              ⬇️ Download
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedPurchaseOrders;
