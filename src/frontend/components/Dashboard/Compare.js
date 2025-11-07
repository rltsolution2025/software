// import React, { useEffect, useState } from "react";

// function Compare({ excelData }) {
//   const [categories] = useState(["Pump", "Evaporator", "MBR", "Scrapper", "Filters"]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [uniqueItems, setUniqueItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [specHeaders, setSpecHeaders] = useState([]);

//   useEffect(() => {
//     if (excelData.length > 0) {
//       setSpecHeaders(excelData[0].slice(1));   // Extract B1 → P1 as Specifications header
//     }
//   }, [excelData]);

//  const handleCategoryChange = (e) => {
//   const category = e.target.value;
//   setSelectedCategory(category);
//   setSelectedItems([]); 

//   // ✅ Get ALL values from A column except header
//   const items = excelData
//     .slice(1)                 // ignore header
//     .map((row) => row[0])     // get column A values
//     .filter((val) => val);    // remove null/empty

//   setUniqueItems([...new Set(items)]); // ✅ Show unique A column identifiers
// };


//   const handleCheckboxChange = (item) => {
//     let updated = [...selectedItems];

//     if (updated.includes(item)) {
//       updated = updated.filter((val) => val !== item);
//     } else {
//       if (updated.length >= 5) {
//         alert("Maximum 5 items allowed for comparison.");
//         return;
//       }
//       updated.push(item);
//     }

//     setSelectedItems(updated);
//   };

//   const getValue = (identifier, specIndex) => {
//     const row = excelData.find((r) => r[0] === identifier);
//     return row ? row[specIndex + 1] : "-";
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Compare Specifications</h2>

//       {/* ================= CATEGORY DROPDOWN ================= */}
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

//       {/* ================= SELECT ITEMS CHECKBOX LIST ================= */}
//       {selectedCategory !== "" && (
//         <>
//           <label><strong>Select Items to Compare (Max 5)</strong></label>
//           <div
//             style={{
//               border: "1px solid #ccc",
//               padding: "15px",
//               borderRadius: "8px",
//               maxHeight: "200px",
//               overflowY: "auto",
//               marginBottom: "20px",
//             }}
//           >
//             {uniqueItems.length === 0 ? (
//               <p style={{ color: "red" }}>No items found under this category.</p>
//             ) : (
//               uniqueItems.map((item, index) => (
//                 <div key={index}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.includes(item)}
//                       onChange={() => handleCheckboxChange(item)}
//                       style={{ marginRight: "8px" }}
//                     />
//                     {item}
//                   </label>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}

//       {/* ================= COMPARISON TABLE ================= */}
//       {selectedItems.length > 0 && (
//         <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f3f3f3" }}>
//               <th>Specification</th>
//               {selectedItems.map((identifier, idx) => (
//                 <th key={idx}>{identifier}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {specHeaders.map((spec, index) => (
//               <tr key={index}>
//                 <td><strong>{spec}</strong></td>
//                 {selectedItems.map((identifier, colIdx) => (
//                   <td key={colIdx}>{getValue(identifier, index)}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default Compare;

import React, { useEffect, useState } from "react";

const Compare = ({ excelData }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [columnValues, setColumnValues] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [specHeaders, setSpecHeaders] = useState([]);

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
          <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
            {columnValues.length === 0 ? <p style={{ color: "red" }}>No items found under this category.</p>
            : columnValues.map((val, idx) => (
              <div key={idx}>
                <label>
                  <input type="checkbox" checked={selectedItems.includes(val)} onChange={() => handleCheckboxSelect(val)} style={{ marginRight: "8px" }} />
                  {val}
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Comparison Table */}
      {selectedItems.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3" }}>
              <th>Specification</th>
              {selectedItems.map((id, idx) => <th key={idx}>{id}</th>)}
            </tr>
          </thead>
          <tbody>
            {specHeaders.map((spec, idx) => (
              <tr key={idx}>
                <td><strong>{spec}</strong></td>
                {selectedItems.map((id, colIdx) => <td key={colIdx}>{getValue(id, idx)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Compare;
