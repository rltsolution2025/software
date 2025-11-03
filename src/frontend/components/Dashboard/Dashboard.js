import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';
import api from '../../services/api.js';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mt-5"
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
              </h1>
              {/* Added role display */}
              <div className="text-center mb-3">
                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                  Role: {user?.role}
                </span>
              </div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <motion.ul
                  className="list-group list-group-flush"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.map((item, index) => (
                    <motion.li
                      key={index}
                      className="list-group-item"
                      variants={itemVariants}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
              <div className="text-center mt-4">
                <motion.button
                  className="btn btn-danger"
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
