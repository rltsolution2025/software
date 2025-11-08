import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedPurchaseOrders = () => {
  const [poList, setPoList] = useState([]);

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/purchase-orders/list");
        setPoList(res.data.purchaseOrders || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPOs();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Saved Purchase Orders</h2>
      {poList.length === 0 ? (
        <p>No saved purchase orders.</p>
      ) : (
        <ul>
          {poList.map((po, idx) => (
            <li key={idx}>
              <a href={`http://localhost:5000/uploads/purchase_orders/${po.filename}`} target="_blank" rel="noopener noreferrer">
                {po.filename} ⬇️
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPurchaseOrders;
