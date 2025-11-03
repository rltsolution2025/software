import React from 'react';
import LoginForm from '../components/LoginForm.js';
import { motion } from 'framer-motion'; // For animations

const LoginPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-light min-vh-100 d-flex align-items-center justify-content-center"
  >
    <LoginForm />
  </motion.div>
);

export default LoginPage;
