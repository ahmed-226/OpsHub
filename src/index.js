const express = require('express');
const urlRoutes = require('./routes/url.routes');
// const { setupMetrics } = require('./monitoring/metrics');
const db = require('./config/database');

const app = express();
const port = 3000;

app.use(express.json());

// Setup Prometheus metrics endpoint
// setupMetrics(app);

app.use('/', urlRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`URL shortener service running on http://localhost:${port}`);
});
