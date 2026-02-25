const express = require('express');
const router = express.Router();

router.get('/:serverId', (req, res) => {
  res.json({ message: 'List channels' });
});

router.post('/:serverId', (req, res) => {
  res.json({ message: 'Create channel' });
});

module.exports = router;
