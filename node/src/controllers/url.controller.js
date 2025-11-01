const short = require('short-uuid');
const Url = require('../models/url.model');
const redisClient = require('../config/redis');

const handleCreateShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    // httpShortenFailuresTotal.inc();
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    // httpShortenFailuresTotal.inc();
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const existingUrl = await Url.findOne({
      where: { originalUrl: originalUrl }
    });

    if (existingUrl) {
      // Return existing short URL
      const shortUrl = `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}`;
      return res.status(200).json({
        originalUrl,
        shortUrl,
        shortCode: existingUrl.shortCode,
        message: 'URL already exists'
      });
    }

    // httpShortensTotal.inc();

    const shortCode = short.generate();

    const newUrl = await Url.create({
      originalUrl: originalUrl,
      shortCode: shortCode,
    });
    redisClient.set(shortCode, originalUrl);

    const shortUrl = `${req.protocol}://${req.get('host')}/${newUrl.shortCode}`;
    res.status(201).json({ originalUrl, shortUrl, shortCode: newUrl.shortCode });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // httpShortenFailuresTotal.inc();
      return res.status(409).json({ error: 'Short code already exists. Please try again.' });
    }
    console.error('Error creating short URL:', error.message);
    // httpShortenFailuresTotal.inc();
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handleRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    let url = await redisClient.get(shortCode);
    if (!url) {
      const urlRow = await Url.findOne({
        where: { shortCode: shortCode },
      });
      if (urlRow) {
        redisClient.set(shortCode, urlRow.originalUrl);
        url = urlRow.originalUrl;
      }
    }
    if (url) {
      // HttpRedirectsTotal.labels(shortCode).inc();
      res.redirect(301, url);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error redirecting:', error.message);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  handleCreateShortUrl,
  handleRedirect,
};
