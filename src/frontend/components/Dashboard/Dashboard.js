// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import "bootstrap/dist/css/bootstrap.min.css";
// import PurchaseOrder from "./PurchaseOrder";
// import Compare from "./Compare";
// import WelcomeDashboard from "./DashobaordHome";
// import Delivery from "../Delivery";
// import { AuthContext } from "../../contexts/AuthContext";
// import Notifications from "./Notifications";
// import UserManagement from "./UserManagement";

// const Dashboard = () => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [file, setFile] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [excelData, setExcelData] = useState([]);
//   const [purchaseData, setPurchaseData] = useState(null);
//   const [savedPOs, setSavedPOs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);  
//   const [searchTerm, setSearchTerm] = useState(""); 


//   const { user } = useContext(AuthContext);


//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("⚠️ No token found. Please log in again.");

//     axios
//       .get("http://localhost:5000/api/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const id = res.data?.user?.id || res.data?.user?._id;
//         if (!id) return alert("User data missing. Please log in again.");
//         setUserId(id);
//       })
//       .catch(() => alert("Failed to fetch user info. Please log in again."));
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const fetchUserFiles = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
//         setUploadedFiles(res.data.files || []);
//       } catch (err) {
//         console.error("Fetch Files Error:", err.response?.data || err.message);
//       }
//     };

//     const fetchSavedPOs = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/purchase-orders/list`);
//         setSavedPOs(res.data.purchaseOrders || []);
//       } catch (err) {
//         console.error("Fetch Saved POs Error:", err.response?.data || err.message);
//       }
//     };

//     fetchUserFiles();
//     fetchSavedPOs();
//   }, [userId]);

//   // File upload handler
//   const handleFileUpload = (e) => setFile(e.target.files[0]);

//   const uploadToServer = async () => {
//     if (!file) return alert("Choose a file");
//     if (!userId) return alert("User ID missing");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);

//     try {
//       await axios.post("http://localhost:5000/api/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("✅ File uploaded successfully!");
//       setFile(null);
//       // Refresh uploaded files
//       const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
//       setUploadedFiles(res.data.files || []);
//       setCurrentPage(1); // reset pagination to first page after upload
//     } catch (error) {
//       console.error(error);
//       alert("❌ File upload failed");
//     }
//   };

//   const loadExcelFromServer = async (fileName) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/uploads/${fileName}`, {
//         responseType: "arraybuffer",
//       });

//       const workbook = XLSX.read(response.data, { type: "array" });
//       const sheets = workbook.SheetNames.map((name) => {
//         const sheet = workbook.Sheets[name];
//         const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//         return { sheetName: name, rows };
//       });

//       setExcelData(sheets);
//       setSelectedItem("Compare");
//     } catch (err) {
//       console.error("Excel load error:", err);
//     }
//   };

//   // Filter uploaded files based on search term
//   const filteredFiles = uploadedFiles.filter((f) =>
//     (f.originalName || f.filename).toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container-fluid vh-100 p-0">
//       <div className="row g-0" style={{ height: "100vh", overflow: "hidden" }}>
//         {/* LEFT SIDEBAR */}
//         <div
//           className="col-2 bg-primary text-white p-3"
//           style={{
//             height: "100vh",
//             overflowY: "auto",
//             position: "sticky",
//             top: 0,
//           }}
//         >
//           <div
//             className="d-flex align-items-center mb-4"
//             style={{ cursor: "pointer" }}
//             onClick={() => setSelectedItem("Dashboard")}
//           >
//             <img
//               src="/assets/RLT_Logo.png"
//               alt="Company Logo"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50px",
//                 backgroundColor: "#fff",
//               }}
//             />
//             <h5 className="ms-2 mb-0">RLT Solutions</h5>
//           </div>

//           <div className="text-left">
//             <h5 style={{ cursor: "pointer" }} onClick={() => setSelectedItem("Files")}>
//               Files
//             </h5>
//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() =>
//                 excelData.length > 0 ? setSelectedItem("Compare") : alert("Upload a file first")
//               }
//             >
//               Compare
//             </h5>
//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedItem("PurchaseOrder")}
//             >
//               Purchase Order
//             </h5>
//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedItem("Delivery")}
//             >
//               Delivery
//             </h5>

//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedItem("Notifications")}
//             >
//               Notifications
//             </h5>

//             {user?.role === "admin" && (
//               <h5
//                 className="mt-4"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setSelectedItem("UserManagement")}
//               >
//                 User Management
//               </h5>
//             )}
//           </div>
//         </div>

//         {/* MAIN CONTENT */}
//         <div
//           className="col-10 p-4 bg-light"
//           style={{
//             height: "100vh",
//             overflowY: "auto",
//           }}
//         >
//           {(!selectedItem || selectedItem === "Dashboard") && <WelcomeDashboard  setSelectedItem={setSelectedItem} />}

//           {selectedItem === "Files" && (
//             <div className="mt-4">
//               <h5>
//                 Selected: <strong>Files</strong>
//               </h5>
//               <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
//                 <label className="form-label">Choose a file to upload</label>
//                 <input type="file" className="form-control mb-3" onChange={handleFileUpload} />
//                 <button
//                   className="btn btn-primary w-100"
//                   onClick={uploadToServer}
//                   disabled={!userId || !file}
//                 >
//                   Upload File
//                 </button>
//               </div>

//               {uploadedFiles.length > 0 ? (
//                 <div className="mt-4">
//                   <h5>Search Files</h5>

//                   {/* 🔹 Search input */}
//                   <input
//                     type="text"
//                     placeholder="Search files..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setCurrentPage(1); // reset pagination when searching
//                     }}
//                     className="form-control mb-3"
//                   />

//                   {/* 🔹 Pagination logic with filtered files */}
//                   {(() => {
//                     const itemsPerPage = 10;
//                     const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
//                     const indexOfLastItem = currentPage * itemsPerPage;
//                     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//                     const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

//                     return (
//                       <>
//                         <ul className="list-group">
//                           {currentFiles.map((f, idx) => (
//                             <li
//                               key={idx}
//                               className="list-group-item d-flex justify-content-between align-items-center"
//                             >
//                               <span>{f.originalName || f.filename}</span>
//                               <div>
//                                 <a
//                                   href={`http://localhost:5000/uploads/${f.filename}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="btn btn-sm btn-outline-primary me-2"
//                                 >
//                                   View
//                                 </a>
//                                 <button
//                                   className="btn btn-sm btn-success"
//                                   onClick={() => loadExcelFromServer(f.filename)}
//                                 >
//                                   Compare
//                                 </button>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>

//                         {/* Pagination Controls */}
//                         <div className="mt-3 d-flex justify-content-center align-items-center gap-2">
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                             disabled={currentPage === 1}
//                           >
//                             Prev
//                           </button>
//                           {[...Array(totalPages)].map((_, idx) => (
//                             <button
//                               key={idx}
//                               className={`btn btn-sm ${
//                                 currentPage === idx + 1 ? "btn-primary" : "btn-outline-primary"
//                               }`}
//                               onClick={() => setCurrentPage(idx + 1)}
//                             >
//                               {idx + 1}
//                             </button>
//                           ))}
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                             disabled={currentPage === totalPages}
//                           >
//                             Next
//                           </button>
//                         </div>
//                       </>
//                     );
//                   })()}
//                 </div>
//               ) : (
//                 <p className="text-muted mt-3">No files uploaded yet.</p>
//               )}
//             </div>
//           )}

//           {selectedItem === "Compare" && excelData.length > 0 && (
//             <Compare excelData={excelData} setPurchaseData={setPurchaseData} />
//           )}

//           {selectedItem === "PurchaseOrder" && (
//             <PurchaseOrder purchaseData={purchaseData} savedPOs={savedPOs} />
//           )}

//           {selectedItem === "Delivery" && (
//             <div className="mt-4">
//               <h5>🚚 Delivery Tracking</h5>
//               <Delivery />
//             </div>
//           )}

//           {selectedItem === "Notifications" && <Notifications />}

//           {selectedItem === "UserManagement" && <UserManagement />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState, useContext } from "react";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

import PurchaseOrder from "./PurchaseOrder";
import Compare from "./Compare";
import WelcomeDashboard from "./DashobaordHome";
import Delivery from "../Delivery";
import Notifications from "./Notifications";
import UserManagement from "./UserManagement";

import { AuthContext } from "../../contexts/AuthContext";

import api from "../../services/api"; // ✅ NEW API IMPORT

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [purchaseData, setPurchaseData] = useState(null);
  const [savedPOs, setSavedPOs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext);

  // --------------------------
  // Fetch User Info
  // --------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ No token found. Please log in again.");

    api
      .get("/api/dashboard")
      .then((res) => {
        const id = res.data?.user?.id || res.data?.user?._id;
        if (!id) return alert("User data missing. Please log in again.");
        setUserId(id);
      })
      .catch(() => alert("Failed to fetch user info. Please log in again."));
  }, []);

  // --------------------------
  // Fetch Uploaded Files + POs
  // --------------------------
  useEffect(() => {
    if (!userId) return;

    const fetchUserFiles = async () => {
      try {
        const res = await api.get(`/api/files/${userId}`);
        setUploadedFiles(res.data.files || []);
      } catch (err) {
        console.error("Fetch Files Error:", err.response?.data || err.message);
      }
    };

    const fetchSavedPOs = async () => {
      try {
        const res = await api.get(`/api/purchase-orders/list`);
        setSavedPOs(res.data.purchaseOrders || []);
      } catch (err) {
        console.error("Fetch Saved POs Error:", err.response?.data || err.message);
      }
    };

    fetchUserFiles();
    fetchSavedPOs();
  }, [userId]);

  // --------------------------
  // Upload Excel File
  // --------------------------
  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const uploadToServer = async () => {
    if (!file) return alert("Choose a file");
    if (!userId) return alert("User ID missing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ File uploaded successfully!");
      setFile(null);

      // Refresh file list
      const res = await api.get(`/api/files/${userId}`);
      setUploadedFiles(res.data.files || []);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("❌ File upload failed");
    }
  };

  // --------------------------
  // Load Excel from Server
  // --------------------------
  const loadExcelFromServer = async (fileName) => {
    try {
      const response = await api.get(`/uploads/${fileName}`, {
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

  // --------------------------
  // Filter Files in Search
  // --------------------------
  const filteredFiles = uploadedFiles.filter((f) =>
    (f.originalName || f.filename).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --------------------------
  // UI Rendering
  // --------------------------
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0" style={{ height: "100vh", overflow: "hidden" }}>

        {/* ---------------- Sidebar ---------------- */}
        <div
          className="col-2 bg-primary text-white p-3"
          style={{ height: "100vh", overflowY: "auto", position: "sticky", top: 0 }}
        >
          <div
            className="d-flex align-items-center mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedItem("Dashboard")}
          >
            <img
              src="/assets/RLT_Logo.png"
              alt="Company Logo"
              style={{ width: "40px", height: "40px", borderRadius: "50px", backgroundColor: "#fff" }}
            />
            <h5 className="ms-2 mb-0">RLT Solutions</h5>
          </div>

          <div className="text-left">
            <h5 onClick={() => setSelectedItem("Files")} style={{ cursor: "pointer" }}>
              Files
            </h5>

            <h5
              className="mt-4"
              onClick={() =>
                excelData.length > 0 ? setSelectedItem("Compare") : alert("Upload a file first")
              }
              style={{ cursor: "pointer" }}
            >
              Compare
            </h5>

            <h5
              className="mt-4"
              onClick={() => setSelectedItem("PurchaseOrder")}
              style={{ cursor: "pointer" }}
            >
              Purchase Order
            </h5>

            <h5
              className="mt-4"
              onClick={() => setSelectedItem("Delivery")}
              style={{ cursor: "pointer" }}
            >
              Delivery
            </h5>

            <h5
              className="mt-4"
              onClick={() => setSelectedItem("Notifications")}
              style={{ cursor: "pointer" }}
            >
              Notifications
            </h5>

            {user?.role === "admin" && (
              <h5
                className="mt-4"
                onClick={() => setSelectedItem("UserManagement")}
                style={{ cursor: "pointer" }}
              >
                User Management
              </h5>
            )}
          </div>
        </div>

        {/* ---------------- Main Content ---------------- */}
        <div
          className="col-10 p-4 bg-light"
          style={{ height: "100vh", overflowY: "auto" }}
        >
          {(!selectedItem || selectedItem === "Dashboard") && (
            <WelcomeDashboard setSelectedItem={setSelectedItem} />
          )}

          {selectedItem === "Files" && (
            <div className="mt-4">
              <h5>
                Selected: <strong>Files</strong>
              </h5>

              {/* Upload Section */}
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

              {/* File List */}
              {uploadedFiles.length > 0 ? (
                <div className="mt-4">
                  <h5>Search Files</h5>

                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="form-control mb-3"
                  />

                  {/* Pagination Logic */}
                  {(() => {
                    const itemsPerPage = 10;
                    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
                    const indexOfLastItem = currentPage * itemsPerPage;
                    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                    const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

                    return (
                      <>
                        <ul className="list-group">
                          {currentFiles.map((f, idx) => (
                            <li
                              key={idx}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>{f.originalName || f.filename}</span>
                              <div>
                                <a
                                  href={`https://software-2-zth5.onrender.com/uploads/${f.filename}`}
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

                        {/* Pagination Buttons */}
                        <div className="mt-3 d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
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
                    );
                  })()}
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

          {selectedItem === "Notifications" && <Notifications />}

          {selectedItem === "UserManagement" && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
