import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,  // ✅ IMPORTANT
          },
          withCredentials: true, // Optional if cookies are used
        });

        console.log("Dashboard Data:", res.data);
        setData(res.data);

      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
    </div>
  );
};

export default Dashboard;
