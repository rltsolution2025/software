import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);

  // ✅ Get logged-in userId from token (assuming backend returns userData)
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserId(res.data.userId); // ⬅️ store userId from backend response
      })
      .catch((err) => console.log("Dashboard Error:", err));
  }, []);

  // ✅ Store selected file
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // ✅ Upload to server (POST /upload)
  const uploadToServer = async () => {
    if (!file) {
      alert("Please choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId); // ✅ send userId to backend

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ File uploaded successfully!");
      setFile(null);  // reset input
    } catch (error) {
      console.error("Upload Error:", error);
      alert("❌ File upload failed");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">

        {/* ✅ LEFT SIDEBAR */}
        <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
          {/* Only show Files menu */}
          <h5
            className="text-center"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedItem("Files")}
          >
            📁 Files
          </h5>
        </div>

        {/* ✅ RIGHT SIDE CONTENT */}
        <div className="col-10 p-4 bg-light">
          <h3>Dashboard</h3>

          {!selectedItem && (
            <div className="alert alert-info mt-3">
              👇 Click on <strong>📁 Files</strong> to upload a file.
            </div>
          )}

          {selectedItem && (
            <div className="mt-4">
              <h5>
                Selected: <strong>{selectedItem}</strong>
              </h5>

              <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
                <label className="form-label">Choose a file to upload</label>
                <input type="file" className="form-control mb-3" onChange={handleFileUpload} />

                <button className="btn btn-primary w-100" onClick={uploadToServer}>
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
