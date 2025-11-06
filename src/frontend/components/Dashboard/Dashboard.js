// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Dashboard = () => {
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [file, setFile] = useState(null);
//   const [userId, setUserId] = useState("");

//   // ✅ Fetch user info using token
//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("⚠️ No token found. Please log in again.");
//     return;
//   }

//   axios
//     .get("http://localhost:5000/api/dashboard", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((res) => {
//       console.log("Dashboard API response:", res.data);

//       // ✅ Get user ID based on backend response
//       const id = res.data.user?.id || res.data.user?._id;

//       if (!id) {
//         console.warn("⚠️ No userId found in response:", res.data);
//         alert("User data missing. Please log in again.");
//         return;
//       }

//       setUserId(id); // ✅ userId is now set correctly
//       console.log("User ID set:", id);
//     })
//     .catch((err) => {
//       console.error("Dashboard Error:", err);
//       alert("Failed to fetch user info. Please log in again.");
//     });
// }, []);


//   // ✅ Store selected file
//   const handleFileUpload = (e) => {
//     const uploadedFile = e.target.files[0];
//     setFile(uploadedFile);
//   };

//   // ✅ Upload to server (POST /upload)
//   // const uploadToServer = async () => {
//   //   if (!file) {
//   //     alert("Please choose a file");
//   //     return;
//   //   }
//   //   const formData = new FormData();
//   //   formData.append("file", file);
//   //   formData.append("userId", userId);

//   //   console.log("Uploading with userId:", userId);

//   //   try {
//   //     const res = await axios.post(
//   //       "http://localhost:5000/api/upload",
//   //       formData,
//   //       {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       }
//   //     );

//   //     console.log("Upload success:", res.data);
//   //     alert("✅ File uploaded successfully!");
//   //     setFile(null); // reset input
//   //   } catch (error) {
//   //     console.error("Upload Error:", error.response?.data || error.message);
//   //     alert("❌ File upload failed");
//   //   }
//   // };
// const uploadToServer = async () => {
//   if (!file) return alert("Please choose a file");
//   if (!userId) return alert("⚠️ User ID missing. Wait for user info to load.");

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("userId", userId);

//   try {
//     const res = await axios.post("http://localhost:5000/api/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     alert("✅ File uploaded successfully!");
//     setFile(null);
//   } catch (error) {
//     console.error("Upload Error:", error.response?.data || error.message);
//   }
// };

//   return (
//     <div className="container-fluid vh-100 p-0">
//       <div className="row g-0">
//         {/* ✅ LEFT SIDEBAR */}
//         <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
//           <h5
//             className="text-center"
//             style={{ cursor: "pointer" }}
//             onClick={() => setSelectedItem("Files")}
//           >
//             📁 Files
//           </h5>
//         </div>

//         {/* ✅ RIGHT SIDE CONTENT */}
//         <div className="col-10 p-4 bg-light">
//           <h3>Dashboard</h3>

//           {!selectedItem && (
//             <div className="alert alert-info mt-3">
//               👇 Click on <strong>📁 Files</strong> to upload a file.
//             </div>
//           )}

//           {selectedItem && (
//             <div className="mt-4">
//               <h5>
//                 Selected: <strong>{selectedItem}</strong>
//               </h5>

//               <div
//                 className="card p-3 mt-3 shadow-sm"
//                 style={{ maxWidth: "400px" }}
//               >
//                 <label className="form-label">Choose a file to upload</label>
//                 <input
//                   type="file"
//                   className="form-control mb-3"
//                   onChange={handleFileUpload}
//                 />

//                 <button className="btn btn-primary w-100" onClick={uploadToServer}  disabled={!userId || !file} >
//                   Upload File
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // ✅ Fetch user info using token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ No token found. Please log in again.");
      return;
    }

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Dashboard API response:", res.data);

        // ✅ Extract userId safely
        const id = res.data?.user?.id || res.data?.user?._id || res.data?.id || "";

        if (!id) {
          console.warn("⚠️ No userId found in response:", res.data);
          alert("User data missing. Please log in again.");
          return;
        }

        setUserId(id);
        console.log("✅ User ID set:", id);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
        alert("Failed to fetch user info. Please log in again.");
      });
  }, []);

  // ✅ Fetch all uploaded files for the user
  const fetchUserFiles = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/files/${userId}`);
      setUploadedFiles(res.data.files || []);
    } catch (err) {
      console.error("Fetch Files Error:", err.response?.data || err.message);
    }
  };

  // Fetch user files automatically once userId is available
  useEffect(() => {
    if (userId) fetchUserFiles();
  }, [userId]);

  // ✅ Handle file selection
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // ✅ Upload selected file to server
  const uploadToServer = async () => {
    if (!file) return alert("Please choose a file");
    if (!userId) return alert("⚠️ User ID missing. Wait for user info to load.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    console.log("Uploading with userId:", userId);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Upload success:", res.data);
      alert("✅ File uploaded successfully!");
      setFile(null);
      fetchUserFiles(); // Refresh file list after upload
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert("❌ File upload failed");
    }
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0">
        {/* ✅ LEFT SIDEBAR */}
        <div className="col-2 bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
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

              {/* ✅ Upload Section */}
              <div className="card p-3 mt-3 shadow-sm" style={{ maxWidth: "400px" }}>
                <label className="form-label">Choose a file to upload</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={handleFileUpload}
                />
                <button
                  className="btn btn-primary w-100"
                  onClick={uploadToServer}
                  disabled={!userId || !file}
                >
                  Upload File
                </button>
              </div>

              {/* ✅ Display Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h5>Your Uploaded Files</h5>
                  <ul className="list-group">
                    {uploadedFiles.map((f, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{f.originalName || f.filename}</span>
                        <a
                          href={`http://localhost:5000/uploads/${f.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadedFiles.length === 0 && (
                <p className="text-muted mt-3">No files uploaded yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
