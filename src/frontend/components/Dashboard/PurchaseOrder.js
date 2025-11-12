// // import React, { useRef, useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";
// // import axios from "axios";
// // import SavedPurchaseOrders from './SavedPurchaseOrders'; // adjust path if needed

// // const PurchaseOrder = () => {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();
// //   const poRef = useRef();
// //   const [savedOrders, setSavedOrders] = useState([]);

// //   // ✅ Fetch saved POs
// //   const fetchSavedOrders = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
// //       if (res.data.success) {
// //         setSavedOrders(res.data.files || []);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching saved orders:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSavedOrders();
// //   }, []);

// //   if (!state) return <p>No purchase order data found.</p>;

// //   const { company, item, specs } = state;

// //   // ✅ PDF generation logic
// //   const generatePDF = async (mode) => {
// //     const element = poRef.current;
// //     const canvas = await html2canvas(element, { scale: 2 });
// //     const imgData = canvas.toDataURL("image/png");

// //     const pdf = new jsPDF("p", "mm", "a4");
// //     const pdfWidth = pdf.internal.pageSize.getWidth();
// //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
// //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

// //     const fileName = `Purchase_Order-${item}-${Date.now()}.pdf`;

// //     if (mode === "download") {
// //       pdf.save(fileName);
// //     } else if (mode === "save") {
// //       const pdfBlob = pdf.output("blob");
// //       const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

// //       const formData = new FormData();
// //       formData.append("file", pdfFile);

// //       try {
// //         const res = await axios.post(
// //           "http://localhost:5000/api/purchase-orders/save",
// //           formData,
// //           { headers: { "Content-Type": "multipart/form-data" } }
// //         );

// //         if (res.data.success) {
// //           alert("✅ Purchase order saved successfully!");
// //           fetchSavedOrders(); // Refresh saved list
// //         } else {
// //           alert("❌ Failed to save purchase order.");
// //         }
// //       } catch (err) {
// //         console.error("Save Error:", err);
// //         alert("❌ Error saving to server.");
// //       }
// //     }
// //   };

// //   return (
// //     <div style={{ padding: "30px", fontFamily: "Arial" }}>
// //       <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
// //         ← Back
// //       </button>

// //       {/* ✅ Action Buttons */}
// //       <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
// //         <button
// //           onClick={() => generatePDF("download")}
// //           style={{
// //             backgroundColor: "#28a745",
// //             color: "#fff",
// //             padding: "10px 15px",
// //             border: "none",
// //             borderRadius: "5px",
// //           }}
// //         >
// //           ⬇️ Download PDF
// //         </button>
// //         <button
// //           onClick={() => generatePDF("save")}
// //           style={{
// //             backgroundColor: "#007bff",
// //             color: "#fff",
// //             padding: "10px 15px",
// //             border: "none",
// //             borderRadius: "5px",
// //           }}
// //         >
// //           💾 Save to Server
// //         </button>
// //       </div>

// //       {/* ✅ Purchase Order Content */}
// //       <div
// //         ref={poRef}
// //         style={{
// //           backgroundColor: "#fff",
// //           padding: "30px",
// //           borderRadius: "10px",
// //           marginBottom: "40px",
// //         }}
// //       >
// //         <div
// //           style={{
// //             backgroundColor: "#fff",
// //             color: "#084381ff",
// //             padding: "20px",
// //             borderRadius: "10px",
// //             marginBottom: "20px",
// //             textAlign: "center",
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               gap: "20px",
// //             }}
// //           >
// //             <img
// //               src="/assets/RLT_Logo.png"
// //               alt="Company Logo"
// //               style={{ width: "80px", height: "80px", objectFit: "contain" }}
// //             />
// //             <h2 style={{ margin: 0, fontSize: "40px" }}>{company.name}</h2>
// //           </div>

// //           <div
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               marginTop: "10px",
// //               flexWrap: "wrap",
// //               gap: "20px",
// //             }}
// //           >
// //             <p style={{ margin: 0 }}>{company.address}</p>
// //             <p style={{ margin: 0 }}>
// //               <strong>Telephone:</strong> {company.phone}
// //             </p>
// //             <p style={{ margin: 0 }}>
// //               <strong>GST:</strong> {company.gst}
// //             </p>
// //             <p style={{ margin: 0 }}>
// //               <strong>CIN:</strong> {company.cin}
// //             </p>
// //           </div>
// //         </div>

// //         <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />

// //         <h3>Purchase Order for: {item}</h3>

// //         <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
// //           <thead>
// //             <tr style={{ backgroundColor: "#f3f3f3" }}>
// //               <th>Specification</th>
// //               <th>Details</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {specs.map((s, idx) => (
// //               <tr key={idx}>
// //                 <td><strong>{s.name}</strong></td>
// //                 <td>{s.value}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         <p style={{ marginTop: "40px", textAlign: "center" }}>
// //           <em>Thank you for choosing RL Technologies.</em>
// //         </p>
// //         <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />
// //         <div style={{ textAlign: "center", marginTop: "20px", color: "#084381ff", fontWeight: "bold" }}>
// //           <p>Chennai * Madurai * Coimbatore * Bengaluru</p>
// //         </div>
// //       </div>

// //       {/* ✅ Use the separate SavedPurchaseOrders component */}
// //       <SavedPurchaseOrders savedOrders={savedOrders} />
// //     </div>
// //   );
// // };

// // export default PurchaseOrder;


// import React, { useRef, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import axios from "axios";
// import SavedPurchaseOrders from './SavedPurchaseOrders'; // adjust path if needed

// const PurchaseOrder = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const poRef = useRef();
//   const [savedOrders, setSavedOrders] = useState([]);
//   const [saving, setSaving] = useState(false); // disable save button during request

//   // ✅ Fetch saved POs
//   const fetchSavedOrders = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
//       if (res.data.success) {
//         setSavedOrders(res.data.files || []);
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

//   // ✅ Extract deliveryPeriod, totalAmount, make from specs
//   const deliveryPeriod = specs.find(s => s.name.toLowerCase() === "delivery")?.value || "2 weeks";
//   const totalAmount = specs.find(s => s.name.toLowerCase() === "total amount")?.value || 0;
//   const make = specs.find(s => s.name.toLowerCase() === "make")?.value || "";

//   // ✅ PDF generation logic
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
//       setSaving(true);

//       const pdfBlob = pdf.output("blob");
//       const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

//       const formData = new FormData();
//       formData.append("file", pdfFile);
//       formData.append("deliveryPeriod", deliveryPeriod);
//       formData.append("totalAmount", totalAmount);
//       formData.append("make", make);

//       try {
//         const res = await axios.post(
//           "http://localhost:5000/api/purchase-orders/save",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         if (res.data.success) {
//           alert("✅ Purchase order saved successfully!");
//           console.log("Saved PO Details:", { deliveryPeriod, totalAmount, make });
//           fetchSavedOrders(); // Refresh saved list
//         } else {
//           alert("❌ Failed to save purchase order.");
//         }
//       } catch (err) {
//         console.error("Save Error:", err);
//         alert("❌ Error saving to server.");
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial" }}>
//       <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
//         ← Back
//       </button>

//       {/* ✅ Action Buttons */}
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
//           disabled={saving}
//           style={{
//             backgroundColor: "#007bff",
//             color: "#fff",
//             padding: "10px 15px",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           💾 {saving ? "Saving..." : "Save to Server"}
//         </button>
//       </div>

//       {/* ✅ Purchase Order Content */}
//       <div
//         ref={poRef}
//         style={{
//           backgroundColor: "#fff",
//           padding: "30px",
//           borderRadius: "10px",
//           marginBottom: "40px",
//         }}
//       >
//         <div
//           style={{
//             backgroundColor: "#fff",
//             color: "#084381ff",
//             padding: "20px",
//             borderRadius: "10px",
//             marginBottom: "20px",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "20px",
//             }}
//           >
//             <img
//               src="/assets/RLT_Logo.png"
//               alt="Company Logo"
//               style={{ width: "80px", height: "80px", objectFit: "contain" }}
//             />
//             <h2 style={{ margin: 0, fontSize: "40px" }}>{company.name}</h2>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "10px",
//               flexWrap: "wrap",
//               gap: "20px",
//             }}
//           >
//             <p style={{ margin: 0 }}>{company.address}</p>
//             <p style={{ margin: 0 }}>
//               <strong>Telephone:</strong> {company.phone}
//             </p>
//             <p style={{ margin: 0 }}>
//               <strong>GST:</strong> {company.gst}
//             </p>
//             <p style={{ margin: 0 }}>
//               <strong>CIN:</strong> {company.cin}
//             </p>
//           </div>
//         </div>

//         <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />

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
//                 <td><strong>{s.name}</strong></td>
//                 <td>{s.value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <p style={{ marginTop: "40px", textAlign: "center" }}>
//           <em>Thank you for choosing RL Technologies.</em>
//         </p>
//         <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />
//         <div style={{ textAlign: "center", marginTop: "20px", color: "#084381ff", fontWeight: "bold" }}>
//           <p>Chennai * Madurai * Coimbatore * Bengaluru</p>
//         </div>
//       </div>

//       {/* ✅ Use the separate SavedPurchaseOrders component */}
//       <SavedPurchaseOrders savedOrders={savedOrders} />
//     </div>
//   );
// };

// export default PurchaseOrder;


import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import SavedPurchaseOrders from './SavedPurchaseOrders'; // adjust path if needed

const PurchaseOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const poRef = useRef();
  const [savedOrders, setSavedOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [senderEmail, setSenderEmail] = useState(""); // email state
  const [senderPhone, setSenderPhone] = useState(""); // phone state

  // ✅ Fetch saved POs
  const fetchSavedOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
      if (res.data.success) {
        setSavedOrders(res.data.files || []);
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

  // ✅ Extract deliveryPeriod, totalAmount, make from specs
  const deliveryPeriod = specs.find(s => s.name.toLowerCase() === "delivery")?.value || "2 weeks";
  const totalAmount = specs.find(s => s.name.toLowerCase() === "total amount")?.value || 0;
  const make = specs.find(s => s.name.toLowerCase() === "make")?.value || "";

  // ✅ PDF generation logic
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
      setSaving(true);

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("deliveryPeriod", deliveryPeriod);
      formData.append("totalAmount", totalAmount);
      formData.append("make", make);
      formData.append("senderEmail", senderEmail);
      formData.append("senderPhone", senderPhone);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/purchase-orders/save",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.success) {
          alert("✅ Purchase order saved successfully!");
          console.log("Saved PO Details:", { deliveryPeriod, totalAmount, make, senderEmail, senderPhone });
          fetchSavedOrders(); // Refresh saved list
        } else {
          alert("❌ Failed to save purchase order.");
        }
      } catch (err) {
        console.error("Save Error:", err);
        alert("❌ Error saving to server.");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      {/* ✅ Email & Phone inputs */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="email"
          placeholder="Sender Email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Sender Phone"
          value={senderPhone}
          onChange={(e) => setSenderPhone(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      {/* ✅ Action Buttons */}
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
          disabled={saving}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          💾 {saving ? "Saving..." : "Save to Server"}
        </button>
      </div>

      {/* ✅ Purchase Order Content */}
      <div
        ref={poRef}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "40px",
        }}
      >
        {/* ... rest of PO content stays unchanged */}
        <div style={{ backgroundColor: "#fff", color: "#084381ff", padding: "20px", borderRadius: "10px", marginBottom: "20px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <img src="/assets/RLT_Logo.png" alt="Company Logo" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
            <h2 style={{ margin: 0, fontSize: "40px" }}>{company.name}</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", flexWrap: "wrap", gap: "20px" }}>
            <p style={{ margin: 0 }}>{company.address}</p>
            <p style={{ margin: 0 }}><strong>Telephone:</strong> {company.phone}</p>
            <p style={{ margin: 0 }}><strong>GST:</strong> {company.gst}</p>
            <p style={{ margin: 0 }}><strong>CIN:</strong> {company.cin}</p>
          </div>
        </div>

        <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />
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
        <hr style={{ margin: "30px 0", border: "2px solid #084381ff" }} />
        <div style={{ textAlign: "center", marginTop: "20px", color: "#084381ff", fontWeight: "bold" }}>
          <p>Chennai * Madurai * Coimbatore * Bengaluru</p>
        </div>
      </div>

      {/* ✅ Saved POs */}
      <SavedPurchaseOrders savedOrders={savedOrders} />
    </div>
  );
};

export default PurchaseOrder;
