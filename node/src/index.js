const express = require('express');
const urlRoutes = require('./routes/url.routes');
// const { setupMetrics } = require('./monitoring/metrics');
const db = require('./config/database');
const { collectDefaultMetrics, register } = require('prom-client');



collectDefaultMetrics();

const app = express();
const port = 3000;

app.use(express.json());

// Setup Prometheus metrics endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});


app.use('/api', urlRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`URL shortener service running on http://localhost:${port}`);
});
