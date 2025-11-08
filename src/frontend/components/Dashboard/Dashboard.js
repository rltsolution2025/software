// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import "bootstrap/dist/css/bootstrap.min.css";
// import PurchaseOrder from "./PurchaseOrder";
// import Compare from "./Compare";

// const Dashboard = () => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [file, setFile] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [excelData, setExcelData] = useState([]); // ✅ Include sheet names

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("⚠️ No token found. Please log in again.");

//     axios
//       .get("http://localhost:5000/api/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const id = res.data?.user?.id || res.data?.user?._id || "";
//         if (!id) return alert("User data missing. Please log in again.");
//         setUserId(id);
//       })
//       .catch(() => alert("Failed to fetch user info. Please log in again."));
//   }, []);

//   const fetchUserFiles = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
//       setUploadedFiles(res.data.files || []);
//     } catch (err) {
//       console.error("Fetch Files Error:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchUserFiles();
//   }, [userId]);

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
//       fetchUserFiles();
//     } catch (error) {
//       alert("❌ File upload failed");
//     }
//   };

//   // ✅ Load Excel from server and include actual sheet names
//   const loadExcelFromServer = async (fileName) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/uploads/${fileName}`,
//         { responseType: "arraybuffer" }
//       );

//       const workbook = XLSX.read(response.data, { type: "array" });
//       const sheets = workbook.SheetNames.map((name) => {
//         const sheet = workbook.Sheets[name];
//         const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//         return { sheetName: name, rows };
//       });

//       setExcelData(sheets);
//       setSelectedItem("Compare"); // Go to compare
//     } catch (err) {
//       console.error("Excel load error:", err);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 p-0">
//       <div className="row g-0">
//         {/* LEFT SIDEBAR */}
//         <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
//           <div className="text-center">
//             <h5 style={{ cursor: "pointer" }} onClick={() => setSelectedItem("Files")}>
//               📁 Files
//             </h5>
//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => excelData.length > 0 ? setSelectedItem("Compare") : alert("Upload a file first")}
//             >
//               🔍 Compare
//             </h5>
//             <h5
//               className="mt-4"
//               style={{ cursor: "pointer" }}
//               onClick={() => excelData.length > 0 ? setSelectedItem("purchaseOrder") : alert("confirm a comparison first")}
//             >
//               Purchase Order
//             </h5>
//           </div>
//         </div>

//         {/* RIGHT SIDE CONTENT */}
//         <div className="col-10 p-4 bg-light">
//           <h3>Dashboard</h3>

//           {!selectedItem && (
//             <div className="alert alert-info mt-3">
//               👇 Click <strong>📁 Files</strong> or <strong>🔍 Compare</strong> from sidebar.
//             </div>
//           )}

//           {selectedItem === "Files" && (
//             <div className="mt-4">
//               <h5>Selected: <strong>Files</strong></h5>

//               {/* Upload Section */}
//               <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
//                 <label className="form-label">Choose a file to upload</label>
//                 <input type="file" className="form-control mb-3" onChange={handleFileUpload} />
//                 <button className="btn btn-primary w-100" onClick={uploadToServer} disabled={!userId || !file}>
//                   Upload File
//                 </button>
//               </div>

//               {/* Display Uploaded Files */}
//               {uploadedFiles.length > 0 ? (
//                 <div className="mt-4">
//                   <h5>Your Uploaded Files</h5>
//                   <ul className="list-group">
//                     {uploadedFiles.map((f, index) => (
//                       <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//                         <span>{f.originalName || f.filename}</span>

//                         <div>
//                           <a
//                             href={`http://localhost:5000/uploads/${f.filename}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="btn btn-sm btn-outline-primary me-2"
//                           >
//                             View
//                           </a>

//                           <button
//                             className="btn btn-sm btn-success"
//                             onClick={() => loadExcelFromServer(f.filename)}
//                           >
//                             Compare
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ) : (
//                 <p className="text-muted mt-3">No files uploaded yet.</p>
//               )}
//             </div>
//           )}

//           {/* Compare */}
//           {selectedItem === "Compare" && excelData.length > 0 && (
//             <Compare excelData={excelData} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import PurchaseOrder from "./PurchaseOrder";
import Compare from "./Compare";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [purchaseData, setPurchaseData] = useState(null); // ✅ Added for purchase order

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ No token found. Please log in again.");

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const id = res.data?.user?.id || res.data?.user?._id || "";
        if (!id) return alert("User data missing. Please log in again.");
        setUserId(id);
      })
      .catch(() => alert("Failed to fetch user info. Please log in again."));
  }, []);

  const fetchUserFiles = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
      setUploadedFiles(res.data.files || []);
    } catch (err) {
      console.error("Fetch Files Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (userId) fetchUserFiles();
  }, [userId]);

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
      fetchUserFiles();
    } catch (error) {
      alert("❌ File upload failed");
    }
  };

  // ✅ Load Excel from server and include actual sheet names
  const loadExcelFromServer = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/uploads/${fileName}`,
        { responseType: "arraybuffer" }
      );

      const workbook = XLSX.read(response.data, { type: "array" });
      const sheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return { sheetName: name, rows };
      });

      setExcelData(sheets);
      setSelectedItem("Compare"); // Go to compare
    } catch (err) {
      console.error("Excel load error:", err);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">
        {/* LEFT SIDEBAR */}
        <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
          <div className="text-center">
            <h5 style={{ cursor: "pointer" }} onClick={() => setSelectedItem("Files")}>
              📁 Files
            </h5>

            <h5
              className="mt-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                excelData.length > 0
                  ? setSelectedItem("Compare")
                  : alert("Upload a file first")
              }
            >
              🔍 Compare
            </h5>

            <h5
              className="mt-4"
              style={{ cursor: "pointer" }}
              onClick={() =>
                purchaseData
                  ? setSelectedItem("purchaseOrder")
                  : alert("Confirm a comparison first")
              }
            >
              🧾 Purchase Order
            </h5>
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="col-10 p-4 bg-light">
          <h3>Dashboard</h3>

          {!selectedItem && (
            <div className="alert alert-info mt-3">
              👇 Click <strong>📁 Files</strong> or <strong>🔍 Compare</strong> from sidebar.
            </div>
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

              {/* Display Uploaded Files */}
              {uploadedFiles.length > 0 ? (
                <div className="mt-4">
                  <h5>Your Uploaded Files</h5>
                  <ul className="list-group">
                    {uploadedFiles.map((f, index) => (
                      <li
                        key={index}
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

          {/* Compare */}
          {selectedItem === "Compare" && excelData.length > 0 && (
            <Compare excelData={excelData} setPurchaseData={setPurchaseData} />
          )}

          {/* ✅ Purchase Order Page */}
          {selectedItem === "purchaseOrder" && purchaseData && (
            <PurchaseOrder purchaseData={purchaseData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
