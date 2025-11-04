const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json({
      message: 'Admin Dashboard: Full ERP access',
      data: ['Reports', 'Users', 'Inventory'],
    });
  } else {
    res.json({
      message: 'User Dashboard: Limited ERP access',
      data: ['My Tasks', 'Profile'],
    });
  }
});

module.exports = router;
