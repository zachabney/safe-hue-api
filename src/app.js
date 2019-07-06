const config = require('./config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

const authMiddleware = require('./auth-middleware');
app.use(authMiddleware.isAuthenticated);

const hue = require('./hue');

app.post('/colortemp', async (req, res) => {
  const colorTemp = req.body.colorTemp;
  if (colorTemp) {
    await hue.setAllToColor(colorTemp);
    res.sendStatus(200);
  }
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
