const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('./handleErrorAsync');
const appError = require('./appError');

const sendGenerateJWT = (statusCode, user, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  res.status(statusCode).json({
    status: 'success',
    token,
    id: user.id,
  });
};

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    const auth = await jwt.verify(token, process.env.JWT_SECRET);
    if (!auth) {
      return next(appError(400, 'please log in'));
    }
    req.user = user;
    next();
  }
});

module.exports = {
  sendGenerateJWT,
  isAuth,
};
