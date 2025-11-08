// import React, { useEffect, useState } from "react";

// const Compare = ({ excelData }) => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [columnValues, setColumnValues] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [specHeaders, setSpecHeaders] = useState([]);

//   useEffect(() => {
//     if (!excelData || excelData.length === 0) return;
//     const sheetNames = excelData.map(sheet => sheet.sheetName);
//     setCategories(sheetNames);
//   }, [excelData]);

//   const handleCategoryChange = (e) => {
//     const category = e.target.value;
//     setSelectedCategory(category);
//     setSelectedItems([]);

//     const sheet = excelData.find(s => s.sheetName === category);
//     if (!sheet || !sheet.rows || sheet.rows.length === 0) return;

//     const rows = sheet.rows;
//     setSpecHeaders(rows[0].slice(1)); // B1 → Specs
//     const values = rows.slice(1).map(r => r[0]).filter(Boolean); // Column A except header
//     setColumnValues([...new Set(values)]); // Unique
//   };

//   const handleCheckboxSelect = (value) => {
//     let newValues = [...selectedItems];
//     if (newValues.includes(value)) newValues = newValues.filter(i => i !== value);
//     else if (newValues.length < 5) newValues.push(value);
//     else alert("You can select only up to 5 items");
//     setSelectedItems(newValues);
//   };

//   const getValue = (identifier, specIndex) => {
//     const sheet = excelData.find(s => s.sheetName === selectedCategory);
//     if (!sheet) return "-";
//     const row = sheet.rows.find(r => r[0] === identifier);
//     return row ? row[specIndex + 1] : "-";
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Compare Specifications</h2>

//       {/* Category Dropdown */}
//       <label><strong>Select Category</strong></label>
//       <select
//         value={selectedCategory}
//         onChange={handleCategoryChange}
//         style={{ display: "block", width: "250px", padding: "8px", margin: "10px 0" }}
//       >
//         <option value="">-- Select Category --</option>
//         {categories.map((cat, idx) => (
//           <option key={idx} value={cat}>{cat}</option>
//         ))}
//       </select>

//       {/* Column A as checkbox */}
//       {selectedCategory && (
//         <>
//           <label><strong>Select Items to Compare (Max 5)</strong></label>
//           <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
//             {columnValues.length === 0 ? <p style={{ color: "red" }}>No items found under this category.</p>
//             : columnValues.map((val, idx) => (
//               <div key={idx}>
//                 <label>
//                   <input type="checkbox" checked={selectedItems.includes(val)} onChange={() => handleCheckboxSelect(val)} style={{ marginRight: "8px" }} />
//                   {val}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Comparison Table */}
//       {selectedItems.length > 0 && (
//         <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f3f3f3" }}>
//               <th>Specification</th>
//               {selectedItems.map((id, idx) => <th key={idx}>{id}</th>)}
//             </tr>
//           </thead>
//           <tbody>
//             {specHeaders.map((spec, idx) => (
//               <tr key={idx}>
//                 <td><strong>{spec}</strong></td>
//                 {selectedItems.map((id, colIdx) => <td key={colIdx}>{getValue(id, idx)}</td>)}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Compare;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Compare = ({ excelData }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [columnValues, setColumnValues] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [specHeaders, setSpecHeaders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!excelData || excelData.length === 0) return;
    const sheetNames = excelData.map(sheet => sheet.sheetName);
    setCategories(sheetNames);
  }, [excelData]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedItems([]);

    const sheet = excelData.find(s => s.sheetName === category);
    if (!sheet || !sheet.rows || sheet.rows.length === 0) return;

    const rows = sheet.rows;
    setSpecHeaders(rows[0].slice(1)); // B1 → Specs
    const values = rows.slice(1).map(r => r[0]).filter(Boolean); // Column A except header
    setColumnValues([...new Set(values)]); // Unique
  };

  const handleCheckboxSelect = (value) => {
    let newValues = [...selectedItems];
    if (newValues.includes(value)) newValues = newValues.filter(i => i !== value);
    else if (newValues.length < 5) newValues.push(value);
    else alert("You can select only up to 5 items");
    setSelectedItems(newValues);
  };

  const getValue = (identifier, specIndex) => {
    const sheet = excelData.find(s => s.sheetName === selectedCategory);
    if (!sheet) return "-";
    const row = sheet.rows.find(r => r[0] === identifier);
    return row ? row[specIndex + 1] : "-";
  };

  const handleConfirm = (item) => {
    const sheet = excelData.find(s => s.sheetName === selectedCategory);
    const row = sheet.rows.find(r => r[0] === item);

    if (!row) return;

    // Prepare specification data
    const specs = specHeaders.map((header, idx) => ({
      name: header,
      value: row[idx + 1] || "-",
    }));

    // Navigate to purchase order page with data
    navigate("/purchase-order", {
      state: {
        company: {
          name: "RL Technologies",
          address: "123, Tech Park Avenue, Chennai - 600001",
          phone: "+91 98765 43210",
          gst: "GSTIN1234ABCDE",
          cin: "CIN1234567890",
          logo: "https://via.placeholder.com/150?text=Company+Logo",
        },
        item,
        specs,
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Compare Specifications</h2>

      {/* Category Dropdown */}
      <label><strong>Select Category</strong></label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{ display: "block", width: "250px", padding: "8px", margin: "10px 0" }}
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Column A as checkbox */}
      {selectedCategory && (
        <>
          <label><strong>Select Items to Compare (Max 5)</strong></label>
          <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            marginBottom: "20px"
          }}>
            {columnValues.length === 0 ? (
              <p style={{ color: "red" }}>No items found under this category.</p>
            ) : (
              columnValues.map((val, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(val)}
                      onChange={() => handleCheckboxSelect(val)}
                      style={{ marginRight: "8px" }}
                    />
                    {val}
                  </label>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Comparison Table */}
      {selectedItems.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3" }}>
              <th>Specification</th>
              {selectedItems.map((id, idx) => (
                <th key={idx}>{id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specHeaders.map((spec, idx) => (
              <tr key={idx}>
                <td><strong>{spec}</strong></td>
                {selectedItems.map((id, colIdx) => (
                  <td key={colIdx}>{getValue(id, idx)}</td>
                ))}
              </tr>
            ))}
            {/* Confirm Button Row */}
            <tr style={{ backgroundColor: "#fafafa" }}>
              <td><strong>Action</strong></td>
              {selectedItems.map((item, idx) => (
                <td key={idx} style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleConfirm(item)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Confirm
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Compare;

