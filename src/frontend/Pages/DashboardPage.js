import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard.js'; // Assumes nested folder; change to '../components/Dashboard.js' if flat
import { motion } from 'framer-motion'; // For animations

const DashboardPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-light min-vh-100 d-flex align-items-center justify-content-center"
  >
    <Dashboard />
  </motion.div>
);

export default DashboardPage;
