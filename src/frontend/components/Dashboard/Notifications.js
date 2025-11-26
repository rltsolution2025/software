// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
//       if (!res.data.success) return;

//       const poList = res.data.files || [];
//       const today = new Date();
//       const notifs = [];

//       poList.forEach((po) => {
//         if (!po.deliveryDate) return;

//         const expectedDate = new Date(po.deliveryDate);
//         const receivedDate = po.status === "Delivered" ? new Date(po.receivedDate) : null;

//         // 🚨 Delayed delivery
//         if (po.status !== "Delivered" && today > expectedDate) {
//           notifs.push({
//             type: "delayed",
//             message: `❌ PO "${po.originalName || po.name}" is delayed!`,
//             date: expectedDate,
//           });
//         }

//         // ✅ On-time delivery
//         if (po.status === "Delivered" && receivedDate && receivedDate <= expectedDate) {
//           notifs.push({
//             type: "on-time",
//             message: `✅ PO "${po.originalName || po.name}" delivered on time.`,
//             date: receivedDate,
//           });
//         }

//         // ✉️ Sent PO notification
//         if (po.status === "Sent") {
//           const sentDate = po.sentDate ? new Date(po.sentDate) : today;
//           notifs.push({
//             type: "sent",
//             message: `✉️ PO "${po.originalName || po.name}" has been sent.`,
//             date: sentDate,
//           });
//         }

//         // ⏰ Alert 2 days before delivery
//         const twoDaysBefore = new Date(expectedDate);
//         twoDaysBefore.setDate(expectedDate.getDate() - 2);

//         if (po.status !== "Delivered" && today.toDateString() === twoDaysBefore.toDateString()) {
//           notifs.push({
//             type: "alert",
//             message: `⏰ PO "${po.originalName || po.name}" delivery is due in 2 days.`,
//             date: expectedDate,
//           });
//         }
//       });

//       setNotifications(notifs);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();

//     const interval = setInterval(fetchNotifications, 60 * 60 * 1000); // refresh every hour
//     return () => clearInterval(interval);
//   }, []);

//   if (notifications.length === 0) {
//     return (
//       <div className="container mt-4">
//         <div className="alert alert-info">No notifications at the moment.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Delivery Notifications</h2>
//       <ul className="list-group mt-3">
//         {notifications.map((notif, idx) => (
//           <li
//             key={idx}
//             className={`list-group-item ${
//               notif.type === "delayed"
//                 ? "list-group-item-danger"
//                 : notif.type === "on-time"
//                 ? "list-group-item-success"
//                 : notif.type === "alert"
//                 ? "list-group-item-warning"
//                 : "list-group-item-info"
//             }`}
//           >
//             {notif.message}{" "}
//             <span className="text-muted" style={{ float: "right" }}>
//               {new Date(notif.date).toLocaleDateString("en-GB")}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../services/api"; // ✅ Use central API

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/purchase-orders/list"); // ✅ Updated URL

      if (!res.data.success) return;

      const poList = res.data.files || [];
      const today = new Date();
      const notifs = [];

      poList.forEach((po) => {
        if (!po.deliveryDate) return;

        const expectedDate = new Date(po.deliveryDate);
        const receivedDate = po.status === "Delivered" ? new Date(po.receivedDate) : null;

        // 🚨 Delayed delivery
        if (po.status !== "Delivered" && today > expectedDate) {
          notifs.push({
            type: "delayed",
            message: `❌ PO "${po.originalName || po.name}" is delayed!`,
            date: expectedDate,
          });
        }

        // ✅ Delivered on time
        if (po.status === "Delivered" && receivedDate && receivedDate <= expectedDate) {
          notifs.push({
            type: "on-time",
            message: `✅ PO "${po.originalName || po.name}" delivered on time.`,
            date: receivedDate,
          });
        }

        // ✉️ Sent PO
        if (po.status === "Sent") {
          const sentDate = po.sentDate ? new Date(po.sentDate) : today;
          notifs.push({
            type: "sent",
            message: `✉️ PO "${po.originalName || po.name}" has been sent.`,
            date: sentDate,
          });
        }

        // ⏰ Alert 2 days before delivery
        const twoDaysBefore = new Date(expectedDate);
        twoDaysBefore.setDate(expectedDate.getDate() - 2);

        if (po.status !== "Delivered" && today.toDateString() === twoDaysBefore.toDateString()) {
          notifs.push({
            type: "alert",
            message: `⏰ PO "${po.originalName || po.name}" delivery is due in 2 days.`,
            date: expectedDate,
          });
        }
      });

      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 60 * 60 * 1000); // refresh every hour
    return () => clearInterval(interval);
  }, []);

  if (notifications.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">No notifications at the moment.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Delivery Notifications</h2>

      <ul className="list-group mt-3">
        {notifications.map((notif, idx) => (
          <li
            key={idx}
            className={`list-group-item ${
              notif.type === "delayed"
                ? "list-group-item-danger"
                : notif.type === "on-time"
                ? "list-group-item-success"
                : notif.type === "alert"
                ? "list-group-item-warning"
                : "list-group-item-info"
            }`}
          >
            {notif.message}
            <span className="text-muted" style={{ float: "right" }}>
              {new Date(notif.date).toLocaleDateString("en-GB")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

