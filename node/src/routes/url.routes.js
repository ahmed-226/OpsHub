const express = require('express');
const controller = require('../controllers/url.controller');

const router = express.Router();

router.post('/shorten', controller.handleCreateShortUrl);
router.get('/:shortCode', controller.handleRedirect);

module.exports = router;
