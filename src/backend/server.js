const express = require('express');
const cors = require('cors');
const DB = require('./config/DB');
const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute');
const fileRoutes = require('./routes/fileRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');

const app = express();
DB();

app.use(cors({
   origin: "http://localhost:3000",   // ✅ allow frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, 
})); // Allow frontend requests
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use("/api", fileRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));