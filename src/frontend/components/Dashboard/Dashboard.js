import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import PurchaseOrder from "./PurchaseOrder";
import Compare from "./Compare";
import WelcomeDashboard from "./DashobaordHome";
import { useNavigate } from "react-router-dom";
import Delivery from "../Delivery";
import { AuthContext } from "../../contexts/AuthContext";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [purchaseData, setPurchaseData] = useState(null);
  const [savedPOs, setSavedPOs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Fetch all users (admin only)
  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) return alert("Enter username & password");

    try {
      await axios.post("http://localhost:5000/api/users", {
        username: newUsername,
        password: newPassword,
      });
      setNewUsername("");
      setNewPassword("");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  const toggleBlock = async (id) => {
    await axios.patch(`http://localhost:5000/api/users/block/${id}`);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

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
  <div className="row g-0" style={{ height: "100vh", overflow: "hidden" }}>
    {/* LEFT SIDEBAR */}
    <div
      className="col-2 bg-primary text-white p-3"
      style={{
        height: "100vh",
        overflowY: "auto", // ✅ enables sidebar scrolling
        position: "sticky",
        top: 0,
      }}
    >
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

      <div className="text-left">
        <h5 style={{ cursor: "pointer" }} onClick={() => setSelectedItem("Files")}>Files</h5>
        <h5
          className="mt-4"
          style={{ cursor: "pointer" }}
          onClick={() =>
            excelData.length > 0 ? setSelectedItem("Compare") : alert("Upload a file first")
          }
        >
          Compare
        </h5>
        <h5
          className="mt-4"
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedItem("PurchaseOrder")}
        >
          Purchase Order
        </h5>
        <h5
          className="mt-4"
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedItem("Delivery")}
        >
          Delivery
        </h5>

        {/* ✅ User Management (Admin only) */}
        {user?.role === "admin" && (
          <h5
            className="mt-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedItem("UserManagement")}
          >
            User Management
          </h5>
        )}
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div
      className="col-10 p-4 bg-light"
      style={{
        height: "100vh",
        overflowY: "auto", // ✅ enables main content scroll separately
      }}
    >
      <h3>Dashboard</h3>

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
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
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
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => loadExcelFromServer(f.filename)}
                      >
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

      {selectedItem === "Delivery" && (
        <div className="mt-4">
          <h5>🚚 Delivery Tracking</h5>
          <Delivery />
        </div>
      )}

      {selectedItem === "UserManagement" && (
        <div className="mt-4">
          <h5>👥 User Management</h5>
          <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-success w-100" onClick={handleAddUser}>
              Add User
            </button>
          </div>

          {users.length > 0 ? (
            <div className="mt-4">
              <h5>Existing Users</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Blocked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.blocked ? "Yes" : "No"}</td>
                      <td>
                        <button className="btn btn-warning me-2" onClick={() => toggleBlock(u._id)}>
                          {u.blocked ? "Unblock" : "Block"}
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mt-3">No users found.</p>
          )}
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default Dashboard;
