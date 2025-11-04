import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log("Dashboard Error:", err));
  }, []);

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">

        {/* ✅ LEFT SIDEBAR */}
        <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
          <h5 className="text-center">📁 Files</h5>

          {!data ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-group">
              {data.data?.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedItem(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ RIGHT CONTENT AREA */}
        <div className="col-10 p-4 bg-light">
          <h3>Dashboard</h3>

          {/* If no item is selected — show message */}
          {!selectedItem && (
            <div className="alert alert-info mt-3">
              👋 Click a file from the left panel to upload files.
            </div>
          )}

          {/* ✅ Show upload UI only when a file is selected */}
          {selectedItem && (
            <div className="mt-4">
              <h5>
                Selected File: <strong>{selectedItem}</strong>
              </h5>

              <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
                <label className="form-label">Choose a file to upload</label>
                <input type="file" className="form-control mb-3" />

                <button className="btn btn-primary w-100">
                  Upload File
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
