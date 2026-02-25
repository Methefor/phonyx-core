const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get user by ID' });
});

module.exports = router;
