import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const PurchaseOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const poRef = useRef();

  const [savedOrders, setSavedOrders] = useState([]);

  // Fetch all saved purchase orders
  const fetchSavedOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
      if (res.data.success) {
        setSavedOrders(res.data.files || []); // backend returns files
      }
    } catch (err) {
      console.error("Error fetching saved orders:", err);
    }
  };

  useEffect(() => {
    fetchSavedOrders();
  }, []);

  if (!state) return <p>No purchase order data found.</p>;

  const { company, item, specs } = state;

  const generatePDF = async (mode) => {
    const element = poRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const fileName = `Purchase_Order-${item}-${Date.now()}.pdf`;

    if (mode === "download") {
      pdf.save(fileName);
    } else if (mode === "save") {
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("file", pdfBlob, fileName);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/purchase-orders/save",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.success) {
          alert("✅ Purchase order saved successfully!");
          fetchSavedOrders(); // Refresh saved orders
        } else {
          alert("❌ Failed to save purchase order.");
        }
      } catch (err) {
        console.error("Save Error:", err);
        alert("❌ Error saving to server.");
      }
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      {/* Buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => generatePDF("download")}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ⬇️ Download PDF
        </button>
        <button
          onClick={() => generatePDF("save")}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          💾 Save to Server
        </button>
      </div>

      {/* Current Purchase Order */}
      <div
        ref={poRef}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", justifyContent: "center" }}>
          <div
  style={{
    backgroundColor: "fff", // blue color
    color: "#084381ff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    frontweight: "bold",
  }}
>
  {/* First row: Logo + Company Name */}
  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    <img
      src="/assets/RLT_Logo.png"
      alt="Company Logo"
      style={{ width: "80px", height: "80px", objectFit: "contain" }}
    />
    <h2 style={{ margin: 0 , textAlign: "center", justifyContent: "center", fontSize: "50px" }}>{company.name}</h2>
  </div>

  {/* Second row: Address, Phone, GST, CIN */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
      flexWrap: "wrap",
      gap: "20px",
    }}
  >
    <p style={{ margin: 0 }}>{company.address}</p>
    <p style={{ margin: 0 }}>
      <strong>Telephone:</strong> {company.phone}
    </p>
    <p style={{ margin: 0 }}>
      <strong>GST:</strong> {company.gst}
    </p>
    <p style={{ margin: 0 }}>
      <strong>CIN:</strong> {company.cin}
    </p>
  </div>
</div>

        </div>

        <hr style={{ margin: "30px 0" , border: "2px solid #084381ff"}} />

        <h3>Purchase Order for: {item}</h3>

        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3" }}>
              <th>Specification</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((s, idx) => (
              <tr key={idx}>
                <td>
                  <strong>{s.name}</strong>
                </td>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <p> <strong>Total Amount:</strong> ${Total Amount.toFixed(2)} </p>
        <p> <strong>Tax (5%):</strong> ${(Total Amount * 0.05).toFixed(2)} </p>
        <p> <strong>Grand Total:</strong> ${(Total Amount * 1.05).toFixed(2)} </p> */}


        <p style={{ marginTop: "40px", textAlign: "center" }}>
          <em>Thank you for choosing RL Technologies.</em>
        </p>
        <hr style={{ margin: "30px 0" , border: "2px solid #084381ff"}} />
        <div style={{ textAlign: "center", marginTop: "20px", color: "#084381ff", frontSize: "20px ", fontWeight: "bold" }}>
            <p>Chennai * Madurai * Coimbatore * Bengaluru</p>
        </div>
      </div>

      {/* Saved Purchase Orders */}
      <div>
        <h3>Saved Purchase Orders</h3>
        {savedOrders.length === 0 && <p>No saved purchase orders yet.</p>}
       {savedOrders.map((file, idx) => (
  <div key={idx} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
   <span>{file.originalName || file.name}</span>
    <a
      href={`http://localhost:5000${file.url}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#007bff" }}
    >
      ⬇️ Download
    </a>
  </div>
))}

      </div>
    </div>
  );
};

export default PurchaseOrder;
