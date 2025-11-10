import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import PurchaseOrder from "./PurchaseOrder";
import Compare from "./Compare";
import WelcomeDashboard from "./DashobaordHome";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [purchaseData, setPurchaseData] = useState(null);
  const [savedPOs, setSavedPOs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ No token found. Please log in again.");

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const id = res.data?.user?.id || res.data?.user?._id;
        if (!id) return alert("User data missing. Please log in again.");
        setUserId(id);
      })
      .catch(() => alert("Failed to fetch user info. Please log in again."));
  }, []);

  // Fetch user's files and saved POs when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchUserFiles = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
        setUploadedFiles(res.data.files || []);
      } catch (err) {
        console.error("Fetch Files Error:", err.response?.data || err.message);
      }
    };

    const fetchSavedPOs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/purchase-orders/list`);
        setSavedPOs(res.data.purchaseOrders || []);
      } catch (err) {
        console.error("Fetch Saved POs Error:", err.response?.data || err.message);
      }
    };

    fetchUserFiles();
    fetchSavedPOs();
  }, [userId]);

  // File upload handler
  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const uploadToServer = async () => {
    if (!file) return alert("Choose a file");
    if (!userId) return alert("User ID missing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ File uploaded successfully!");
      setFile(null);

      // Refresh uploaded files
      const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
      setUploadedFiles(res.data.files || []);
    } catch (error) {
      console.error(error);
      alert("❌ File upload failed");
    }
  };

  // Load Excel file from server and parse
  const loadExcelFromServer = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/uploads/${fileName}`, {
        responseType: "arraybuffer",
      });

      const workbook = XLSX.read(response.data, { type: "array" });
      const sheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return { sheetName: name, rows };
      });

      setExcelData(sheets);
      setSelectedItem("Compare");
    } catch (err) {
      console.error("Excel load error:", err);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">

        {/* LEFT SIDEBAR */}
        <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
          {/* Company Logo + Name (Clickable) */}
          <div
            className="d-flex align-items-center mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedItem("Dashboard")}
          >
            <img
              src="/assets/RLT_Logo.png"
              alt="Company Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50px",
                backgroundColor: "#fff",
              }}
            />
            <h5 className="ms-2 mb-0">RLT Solutions</h5>
          </div>

          <div className="text-center">
            <h5 style={{ cursor: "pointer" }} onClick={() => setSelectedItem("Files")}>
              📁 Files
            </h5>

            <h5
              className="mt-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                excelData.length > 0 ? setSelectedItem("Compare") : alert("Upload a file first")
              }
            >
              🔍 Compare
            </h5>

            <h5
              className="mt-4"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedItem("PurchaseOrder")}

            >
              🧾 Purchase Order
            </h5>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-10 p-4 bg-light">
          <h3>Dashboard</h3>

          {/* ✅ Modified to show dashboard when clicked on company logo/name */}
          {(!selectedItem || selectedItem === "Dashboard") && <WelcomeDashboard />}

          {selectedItem === "Files" && (
            <div className="mt-4">
              <h5>
                Selected: <strong>Files</strong>
              </h5>

              <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
                <label className="form-label">Choose a file to upload</label>
                <input type="file" className="form-control mb-3" onChange={handleFileUpload} />

                <button
                  className="btn btn-primary w-100"
                  onClick={uploadToServer}
                  disabled={!userId || !file}
                >
                  Upload File
                </button>
              </div>

              {uploadedFiles.length > 0 ? (
                <div className="mt-4">
                  <h5>Your Uploaded Files</h5>
                  <ul className="list-group">
                    {uploadedFiles.map((f, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{f.originalName || f.filename}</span>
                        <div>
                          <a
                            href={`http://localhost:5000/uploads/${f.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            View
                          </a>

                          <button className="btn btn-sm btn-success" onClick={() => loadExcelFromServer(f.filename)}>
                            Compare
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted mt-3">No files uploaded yet.</p>
              )}
            </div>
          )}

          {selectedItem === "Compare" && excelData.length > 0 && (
            <Compare excelData={excelData} setPurchaseData={setPurchaseData} />
          )}

          {selectedItem === "PurchaseOrder" && (
            <PurchaseOrder purchaseData={purchaseData} savedPOs={savedPOs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
