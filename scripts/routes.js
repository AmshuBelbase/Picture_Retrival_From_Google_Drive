// routes.js
const express = require('express');
const router = express.Router();
const { searchImage, refreshCache } = require('./driveImages');

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const results = await searchImage(q);
    if (!results.length) {
      return res.status(404).json({ message: 'No matches found' });
    }
    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.post('/refresh', async (_req, res) => {
  try {
    const refreshed = await refreshCache();
    res.json({ refreshed: refreshed.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Refresh failed' });
  }
});

module.exports = router;
