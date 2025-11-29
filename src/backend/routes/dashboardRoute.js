// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middlewares/authMiddleware');

// router.get('/dashboard', authenticateToken, (req, res) => {
//   if (req.user.role === 'admin') {
//     res.json({
//       message: 'Admin Dashboard: Full ERP access',
//       data: ['Reports', 'Users', 'Inventory'],
//       user: {
//       id: req.user.id, 
//       username: req.user.username,
//       role: req.user.role,
//     },
//     });
//   } else {
//     res.json({
//       message: 'User Dashboard: Limited ERP access',
//       data: ['My Tasks', 'Profile'],
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res) => {
  
  // ⭐ Always give the logged-in user's info (safe & required for upload)
  const userInfo = {
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  };

  if (req.user.role === 'admin') {
    // ⭐ Admin Dashboard
    return res.json({
      message: 'Admin Dashboard: Full ERP access',
      data: ['Reports', 'Users', 'Inventory'],
      user: userInfo,     // Admin only sees their own details here
    });
  }

  // ⭐ Normal User Dashboard
  res.json({
    message: 'User Dashboard: Limited ERP access',
    data: ['My Tasks', 'Profile'],
    user: userInfo,       // MUST BE PROVIDED so user can upload files
  });
});

module.exports = router;
