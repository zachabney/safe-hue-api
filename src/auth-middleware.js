const config = require('./config')

function isAuthenticated(req, res, next) {
  const token = getToken(req);
  if (token && token === config.apiSecret) {
    return next();
  }

  return res.sendStatus(403);
}

function getToken(req) {
  if (req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ');
    if (authorization[0] === 'Bearer') {
      const token = authorization[1];
      return token;
    }
  }

  return false;
}

module.exports = { isAuthenticated };
