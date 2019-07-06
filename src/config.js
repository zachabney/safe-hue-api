require('dotenv').config();
const secrets = require('@cloudreach/docker-secrets');

module.exports = {
  hue: {
    host: process.env.HUE_BRIDGE,
    user: secrets.hue_user || process.env.HUE_USER
  },
  port: +process.env.PORT || 3000,
  apiSecret: secrets.api_secret || process.env.API_SECRET
};
