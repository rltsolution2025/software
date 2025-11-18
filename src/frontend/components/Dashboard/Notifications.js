import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // 🔹 Fetch all POs and calculate notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
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

        // ✅ On-time delivery
        if (po.status === "Delivered" && receivedDate && receivedDate <= expectedDate) {
          notifs.push({
            type: "on-time",
            message: `✅ PO "${po.originalName || po.name}" delivered on time.`,
            date: receivedDate,
          });
        }

        // ⏰ Alert 2 days before delivery
        const twoDaysBefore = new Date(expectedDate);
        twoDaysBefore.setDate(expectedDate.getDate() - 2);

        if (
          po.status !== "Delivered" &&
          today.toDateString() === twoDaysBefore.toDateString()
        ) {
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

    // Optional: refresh every hour
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (notifications.length === 0) {
    return <div className="container mt-4"><div className="alert alert-info">No notifications at the moment.</div></div>;
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
                : "list-group-item-warning"
            }`}
          >
            {notif.message} <span className="text-muted" style={{ float: "right" }}>{new Date(notif.date).toLocaleDateString("en-GB")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
