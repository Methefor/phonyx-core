const express = require('express');
const router = express.Router();

router.get('/:channelId', (req, res) => {
  res.json({ message: 'Get messages' });
});

router.post('/:channelId', (req, res) => {
  res.json({ message: 'Send message' });
});

module.exports = router;
