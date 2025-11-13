const express = require('express');
const urlRoutes = require('./routes/url.routes');
const db = require('./config/database');
const metrics = require('./monitoring/metrics');
const metricsController = require('./controllers/metrics.controller');


const app = express();
const port = 3000;

app.use(express.json());


app.use('/api', urlRoutes);

app.get('/metrics', metricsController.handleMetrics);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`URL shortener service running on http://localhost:${port}`);
});
