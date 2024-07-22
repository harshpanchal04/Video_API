// middleware/authMiddleware.js
const config = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== config.secret) {
    return res.status(403).send({ auth: false, message: 'No token provided or token is invalid.' });
  }
  next();
};
