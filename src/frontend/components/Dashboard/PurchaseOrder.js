// import React, { useRef, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import axios from "axios";

// const PurchaseOrder = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const poRef = useRef();

//   const [savedOrders, setSavedOrders] = useState([]);

//   // Fetch all saved purchase orders
//   const fetchSavedOrders = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/purchase-orders");
//       if (res.data.success) {
//         setSavedOrders(res.data.orders || []);
//       }
//     } catch (err) {
//       console.error("Error fetching saved orders:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSavedOrders();
//   }, []);

//   if (!state) return <p>No purchase order data found.</p>;

//   const { company, item, specs } = state;

//   const generatePDF = async (mode) => {
//     const element = poRef.current;
//     const canvas = await html2canvas(element, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//     const fileName = `Purchase_Order-${item}-${Date.now()}.pdf`;

//     if (mode === "download") {
//       pdf.save(fileName);
//     } else if (mode === "save") {
//       const pdfBlob = pdf.output("blob");
//       const formData = new FormData();
//       formData.append("file", pdfBlob, fileName);

//       try {
//         // Save to backend under /purchase-orders route
//         const res = await axios.post(
//           "http://localhost:5000/api/purchase-orders",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         if (res.data.success) {
//           alert("✅ Purchase order saved successfully!");
//           fetchSavedOrders(); // Refresh saved orders
//         } else {
//           alert("❌ Failed to save purchase order.");
//         }
//       } catch (err) {
//         console.error("Save Error:", err);
//         alert("❌ Error saving to server.");
//       }
//     }
//   };

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial" }}>
//       <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
//         ← Back
//       </button>

//       {/* Buttons */}
//       <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
//         <button
//           onClick={() => generatePDF("download")}
//           style={{
//             backgroundColor: "#28a745",
//             color: "#fff",
//             padding: "10px 15px",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           ⬇️ Download PDF
//         </button>
//         <button
//           onClick={() => generatePDF("save")}
//           style={{
//             backgroundColor: "#007bff",
//             color: "#fff",
//             padding: "10px 15px",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           💾 Save to Server
//         </button>
//       </div>

//       {/* Current Purchase Order */}
//       <div
//         ref={poRef}
//         style={{
//           backgroundColor: "#fff",
//           padding: "30px",
//           borderRadius: "10px",
//           marginBottom: "40px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//           <img
//             src={company.logo}
//             alt="Company Logo"
//             style={{ width: "120px", height: "120px", objectFit: "contain" }}
//           />
//           <div>
//             <h2>{company.name}</h2>
//             <p>{company.address}</p>
//             <p>
//               <strong>Telephone:</strong> {company.phone}
//             </p>
//             <p>
//               <strong>GST:</strong> {company.gst}
//             </p>
//             <p>
//               <strong>CIN:</strong> {company.cin}
//             </p>
//           </div>
//         </div>

//         <hr style={{ margin: "20px 0" }} />

//         <h3>Purchase Order for: {item}</h3>

//         <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f3f3f3" }}>
//               <th>Specification</th>
//               <th>Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {specs.map((s, idx) => (
//               <tr key={idx}>
//                 <td>
//                   <strong>{s.name}</strong>
//                 </td>
//                 <td>{s.value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <p style={{ marginTop: "40px", textAlign: "center" }}>
//           <em>Thank you for choosing RL Technologies.</em>
//         </p>
//       </div>

//       {/* Saved Purchase Orders */}
//       <div>
//         <h3>Saved Purchase Orders</h3>
//         {savedOrders.length === 0 && <p>No saved purchase orders yet.</p>}
//         {savedOrders.map((file, idx) => (
//           <div
//             key={idx}
//             style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}
//           >
//             <span>{file.filename}</span>
//             <a
//               href={`http://localhost:5000/uploads/purchase-orders/${file.filename}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "#007bff" }}
//             >
//               ⬇️ Download
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrder;

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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={company.logo}
            alt="Company Logo"
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
          <div>
            <h2>{company.name}</h2>
            <p>{company.address}</p>
            <p>
              <strong>Telephone:</strong> {company.phone}
            </p>
            <p>
              <strong>GST:</strong> {company.gst}
            </p>
            <p>
              <strong>CIN:</strong> {company.cin}
            </p>
          </div>
        </div>

        <hr style={{ margin: "20px 0" }} />

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

        <p style={{ marginTop: "40px", textAlign: "center" }}>
          <em>Thank you for choosing RL Technologies.</em>
        </p>
      </div>

      {/* Saved Purchase Orders */}
      <div>
        <h3>Saved Purchase Orders</h3>
        {savedOrders.length === 0 && <p>No saved purchase orders yet.</p>}
        {savedOrders.map((file, idx) => (
          <div
            key={idx}
            style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span>{file.name}</span>
            <a
              href={`http://localhost:5000/uploads/purchase_orders/${file.name}`}
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
