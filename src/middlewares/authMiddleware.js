const jwt = require('jsonwebtoken');
const config = require('@config/index');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: '토큰 없음' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Bearer 형식 아님' });
  try {
    req.user = jwt.verify(token, config.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ msg: '토큰 유효하지 않음', error: err.message });
  }
};