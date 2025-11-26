import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../services/api"; // ✅ use centralized API

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch POs from backend
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/purchase-orders/list"); // ✅ Updated
      if (res.data.success) setOrders(res.data.files || []);
    } catch (err) {
      console.error("Error fetching delivery orders:", err);
    }
  };

  // 🔹 Mark as Sent
  const markAsSent = async (id) => {
    try {
      await api.put(`/api/purchase-orders/mark-sent/${id}`); // ✅ Updated
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
      await api.put(`/api/purchase-orders/mark-delivered/${id}`, {
        status: "Delivered",
        deliveryDate,
      }); // ✅ Updated
      fetchOrders();
    } catch (err) {
      console.error("Mark as delivered failed:", err);
      alert("❌ Failed to mark delivered.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Filter orders safely
  const filteredOrders = orders.filter((po) =>
    ((po.originalName || po.name) || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4">
      <p className="text-muted">
        Track sent dates and expected delivery timelines for POs.
      </p>

      {/* 🔹 Search Input */}
      {orders.length > 0 && (
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by file name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      )}

      {orders.length === 0 ? (
        <div className="alert alert-warning">No purchase orders available.</div>
      ) : (
        <>
          <table className="table table-bordered mt-3 text-center align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>S.NO</th>
                <th>File Name</th>
                <th>Delivery Period</th>
                <th>Sent Date</th>
                <th>Expected Delivery</th>
                <th>Delivery Date</th>
                <th>Status / Action</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((po, index) => (
                <tr key={po._id}>
                  <td>{indexOfFirstItem + index + 1}</td>

                  <td>
                    {po.url ? (
                      <a
                        href={`https://software-2-zth5.onrender.com${po.url}`} // ✅ Updated
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
                          gap: "6px",
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

                  <td>
                    {po.sentDate
                      ? new Date(po.sentDate).toLocaleString("en-GB")
                      : "—"}
                  </td>

                  <td>
                    {po.deliveryDate
                      ? new Date(po.deliveryDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>

                  <td>
                    {po.status === "Delivered"
                      ? new Date(po.receivedDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>

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
              ))}
            </tbody>
          </table>

          {/* 🔹 Pagination Controls */}
          <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${
                  currentPage === idx + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-secondary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Delivery;
