const express = require('express');
const cors = require('cors');
const DB = require('./config/DB');
const authRoutes = require('./routes/authRoute');

const app = express();
DB();

app.use(cors({
   origin: "http://localhost:3000",   // ✅ allow frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, 
})); // Allow frontend requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protected dashboard route (example)
app.get('/api/dashboard', require('./middlewares/authMiddleware').authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json({ message: 'Admin Dashboard: Full ERP access', data: ['Reports', 'Users', 'Inventory'] });
  } else {
    res.json({ message: 'User Dashboard: Limited ERP access', data: ['My Tasks', 'Profile'] });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));