const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', require('../controllers/authController').getUsers);
router.post('/make-admin-by-email/:email', async (req, res) => {
  const user = await require('../models/User').findOneAndUpdate(
    { email: req.params.email },
    { role: 'admin' },
    { new: true }
  );
  if (user) return res.json({ message: 'User promoted to admin', user });
  res.status(404).json({ message: 'User not found' });
});

module.exports = router; 