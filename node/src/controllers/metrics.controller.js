const { register } = require('prom-client');

// Setup Prometheus metrics endpoint
const handleMetrics = async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
};

module.exports = { handleMetrics }; 
