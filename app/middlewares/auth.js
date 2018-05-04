const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/auth');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const [schema, token] = authorization.split(' ');

  if (!schema === 'Bearer') {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, secret);
    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
