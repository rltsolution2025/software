import axios from "axios";

// const api = axios.create({
//   baseURL: "https://software-2-zth5.onrender.com",
// });

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://software-2-zth5.onrender.com"
      : "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("➡️ Sending token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



// import axios from "axios";

// const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://software-2-zth5.onrender.com"
//     : "http://localhost:5000";

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// // Attach token automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
