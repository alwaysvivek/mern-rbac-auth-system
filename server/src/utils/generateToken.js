const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
