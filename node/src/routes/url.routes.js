const express = require('express');
const controller = require('../controllers/url.controller');
const metrics = require('../controllers/metrics.controller');

const router = express.Router();

router.post('/shorten', controller.handleCreateShortUrl);
router.get('/metrics', metrics.handleMetrics);
router.get('/:shortCode', controller.handleRedirect);

module.exports = router;
