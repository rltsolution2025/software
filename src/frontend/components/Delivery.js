// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Delivery = () => {
//   const [orders, setOrders] = useState([]);

//   // 🔹 Fetch POs from backend
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
//       if (res.data.success) setOrders(res.data.files || []);
//     } catch (err) {
//       console.error("Error fetching delivery orders:", err);
//     }
//   };

//   // 🔹 When checkbox is clicked → mark as sent
//   const markAsSent = async (id) => {
//     try {
//       const sendDate = new Date();
//       const expectedDate = new Date(sendDate);
//       expectedDate.setDate(expectedDate.getDate() + 14); // 2 weeks delivery

//       await axios.put(`http://localhost:5000/api/purchase-orders/mark-sent/${id}`, {
//         sentDate: sendDate,
//         deliveryDate: expectedDate,
//         status: "Sent",
//       });

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
//       {/* <h4>🚚 Delivery Tracking</h4> */}
//       <p className="text-muted">Track sent dates and expected delivery timelines for POs.</p>

//       {orders.length === 0 ? (
//         <div className="alert alert-warning">No purchase orders available.</div>
//       ) : (
//         <table className="table table-bordered mt-3 text-center align-middle shadow-sm">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>File Name</th>
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
//                   <td>{po.originalName || po.name}</td>
//                   <td>{po.deliveryPeriod || "2 weeks"}</td>
//                   <td>{po.sentDate ? new Date(po.sentDate).toLocaleString("en-GB") : "—"}</td>
//                   <td>{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString("en-GB") : "—"}</td>
//                   <td>
//                     {!isSent ? (
//                       <input type="checkbox" onChange={() => markAsSent(po._id)} />
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

  // 🔹 Mark as Sent
  const markAsSent = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/purchase-orders/mark-sent/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Mark as sent failed:", err);
      alert("❌ Failed to update order.");
    }
  };

  // 🔹 Mark as Delivered
  const markAsDelivered = async (id) => {
    try {
      const deliveryDate = new Date();
      await axios.put(`http://localhost:5000/api/purchase-orders/mark-delivered/${id}`, {
        status: "Delivered",
        deliveryDate,
      });
      fetchOrders();
    } catch (err) {
      console.error("Mark as delivered failed:", err);
      alert("❌ Failed to mark delivered.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <p className="text-muted">Track sent dates and expected delivery timelines for POs.</p>

      {orders.length === 0 ? (
        <div className="alert alert-warning">No purchase orders available.</div>
      ) : (
        <table className="table table-bordered mt-3 text-center align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>S.NO</th>
              <th>File Name</th>
              <th>Delivery Period</th>
              <th>Sender Email</th>
              <th>Sender Phone</th>
              <th>Sent Date</th>
              <th>Expected Delivery</th>
              <th>Delivery Date</th>
              <th>Status / Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((po, index) => {
              return (
                <tr key={po._id}>
                  <td>{index + 1}</td>
                  {/* 📥 Downloadable File */}
                  <td>
                    {po.url ? (
                      <a
                        href={`http://localhost:5000${po.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                          textDecoration: "none",
                          color: "#0d6efd",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        <span>{po.originalName || po.name}</span>
                        <span role="img" aria-label="download">📥</span>
                      </a>
                    ) : (
                      po.originalName || po.name
                    )}
                  </td>

                  <td>{po.deliveryPeriod || "2 weeks"}</td>
                  <td>{po.senderEmail || "—"}</td>
                  <td>{po.senderPhone || "—"}</td>
                  <td>{po.sentDate ? new Date(po.sentDate).toLocaleString("en-GB") : "—"}</td>
                  <td>{po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString("en-GB") : "—"}</td>
                  <td>
                    {/* Show actual delivery date if Delivered */}
                    {po.status === "Delivered"
                      ? new Date(po.deliveryDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>

                  {/* Action Buttons */}
                  <td>
                    {po.status === "Pending" && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => markAsSent(po._id)}
                      >
                        Mark Sent
                      </button>
                    )}

                    {po.status === "Sent" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => markAsDelivered(po._id)}
                      >
                        Mark Delivered
                      </button>
                    )}

                    {po.status === "Delivered" && (
                      <span className="badge bg-success">✅ Delivered</span>
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
