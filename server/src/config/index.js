require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  // db: {
  //   uri: process.env.DB_URI,
  // }
};
