// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Delivery = () => {
//   const [orders, setOrders] = useState([]);

//   // 🔹 Fetch POs from backend
//   const fetchOrders = async () => {
//     // try {
//     //   const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
//     //   if (res.data.purchaseOrders) {
//     //     setOrders(res.data.purchaseOrders);
//     //   } else {
//     //     console.warn("⚠️ No purchaseOrders found in response");
//     //   }
//     // } catch (err) {
//     //   console.error("Error fetching delivery orders:", err);
    
//     try {
//       const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
//       if (res.data.success) setOrders(res.data.files || []);
//     } catch (err) {
//       console.error("Error fetching delivery orders:", err);
//     }

//     // }
//   };

//   // 🔹 When checkbox is clicked → mark as sent
//   const markAsSent = async (id) => {
//     try {
//       // Current date and time as send date
//       const sendDate = new Date();

//       // Example: Default delivery period = "2 weeks"
//       const order = orders.find((o) => o._id === id);
//       const deliveryPeriod = order?.deliveryPeriod || "2 weeks";
//       const weeks = parseInt(deliveryPeriod);
//       const expectedDate = new Date(sendDate);
//       expectedDate.setDate(expectedDate.getDate() + weeks * 7);

//       const formattedSendDate = sendDate.toLocaleString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const formattedExpected = expectedDate.toLocaleDateString("en-GB");

//       // 🔹 Update backend (if you have endpoint)
//       await axios.put(`http://localhost:5000/api/purchase-orders/mark-sent/${id}`, {
//         sentDate: sendDate,
//         deliveryDate: expectedDate,
//         status: "Sent",
//       });

//       alert("✅ Order marked as sent!");
//       fetchOrders(); // refresh list
//     } catch (err) {
//       console.error("Mark as sent failed:", err);
//       alert("❌ Failed to update order.");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h4>🚚 Delivery Tracking</h4>
//       <p className="text-muted">Track sent dates and expected delivery timelines for POs.</p>

//       {orders.length === 0 ? (
//         <div className="alert alert-warning">No purchase orders available.</div>
//       ) : (
//         <table className="table table-bordered mt-3 text-center align-middle shadow-sm">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>PO Number</th>
//               <th>Vendor</th>
//               <th>Model</th>
//               <th>Delivery Period</th>
//               <th>Sent Date</th>
//               <th>Expected Delivery</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((po, index) => {
//               const isSent = po.status === "Sent" || po.status === "Delivered";
//               return (
//                 <tr key={po._id}>
//                   <td>{index + 1}</td>
//                   <td>{po.poNumber || "N/A"}</td>
//                   <td>{po.vendorName || "N/A"}</td>
//                   <td>{po.modelNo || "N/A"}</td>
//                   <td>{po.deliveryPeriod || "2 weeks"}</td>
//                   <td>
//                     {po.sentDate
//                       ? new Date(po.sentDate).toLocaleString("en-GB")
//                       : "—"}
//                   </td>
//                   <td>
//                     {po.deliveryDate
//                       ? new Date(po.deliveryDate).toLocaleDateString("en-GB")
//                       : "—"}
//                   </td>
//                   <td>
//                     {!isSent ? (
//                       <input
//                         type="checkbox"
//                         onChange={() => markAsSent(po._id)}
//                       />
//                     ) : (
//                       <span className="badge bg-success">✅ Sent</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Delivery;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Delivery = () => {
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch POs from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
      if (res.data.success) setOrders(res.data.files || []);
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
    }
  };

  // 🔹 When checkbox is clicked → mark as sent
  const markAsSent = async (id) => {
    try {
      const sendDate = new Date();
      const expectedDate = new Date(sendDate);
      expectedDate.setDate(expectedDate.getDate() + 14); // 2 weeks delivery

      await axios.put(`http://localhost:5000/api/purchase-orders/mark-sent/${id}`, {
        sentDate: sendDate,
        deliveryDate: expectedDate,
        status: "Sent",
      });

      fetchOrders(); // refresh list
    } catch (err) {
      console.error("Mark as sent failed:", err);
      alert("❌ Failed to update order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      {/* <h4>🚚 Delivery Tracking</h4> */}
      <p className="text-muted">Track sent dates and expected delivery timelines for POs.</p>

      {orders.length === 0 ? (
        <div className="alert alert-warning">No purchase orders available.</div>
      ) : (
        <table className="table table-bordered mt-3 text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Delivery Period</th>
              <th>Sent Date</th>
              <th>Expected Delivery</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((po, index) => {
              const isSent = po.status === "Sent" || po.status === "Delivered";
              return (
                <tr key={po._id}>
                  <td>{index + 1}</td>
                  <td>{po.originalName || po.name}</td>
                  <td>{po.deliveryPeriod || "2 weeks"}</td>
                  <td>{po.sentDate ? new Date(po.sentDate).toLocaleString("en-GB") : "—"}</td>
                  <td>{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString("en-GB") : "—"}</td>
                  <td>
                    {!isSent ? (
                      <input type="checkbox" onChange={() => markAsSent(po._id)} />
                    ) : (
                      <span className="badge bg-success">✅ Sent</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Delivery;
