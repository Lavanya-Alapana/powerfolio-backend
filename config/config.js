// Default configuration for development

require("dotenv").config();
module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/powerfolio',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
};
