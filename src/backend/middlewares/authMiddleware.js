const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("➡️ AUTH HEADER RECEIVED:", authHeader); 

  const token = authHeader && authHeader.split(" ")[1];
  console.log("➡️ EXTRACTED TOKEN:", token);

  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, decoded) => {
    if (err) {
      console.log("❌ JWT ERROR:", err.message);  
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };