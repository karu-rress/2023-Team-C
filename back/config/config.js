/**
 * 
 *  config.js
 *  SQL server configuration
 * 
 *  Created: 2024-01-03
 *  Last modified: -
 * 
 */

const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT,
  dbconfig: {
    server: process.env.DB_DEV_SERVER,
    pool: {
      max: 5,
      min: 1,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true,
      datebase: process.env.DB_DEV_DATEBASE,
      trustServerCertificate: true,
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_DEV_USERNAME,
        password: process.env.DB_DEV_PASSOWRD,
      },
    },
  },
};

module.exports = {
    config
}