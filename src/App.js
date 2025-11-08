import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './frontend/contexts/AuthContext.js';
import PrivateRoute from './frontend/utils/PrivateRoutes.js'; // Corrected to singular 'PrivateRoute'; change back if your file is 'PrivateRoutes.js'
import LoginPage from './frontend/Pages/LoginPage.js';
import DashboardPage from './frontend/Pages/DashboardPage.js';
import { motion } from 'framer-motion'; // For animations
import PurchaseOrder from './frontend/components/Dashboard/PurchaseOrder.js';


function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route path="/purchase-order" element={<PurchaseOrder />} />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </motion.div>
  );
}

export default App;
