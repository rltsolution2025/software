// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ message: 'Access denied' });

//   jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET || "jwtsecret", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded; // ✅ gives role, id
    next();
  });
};

module.exports = { authenticateToken };
