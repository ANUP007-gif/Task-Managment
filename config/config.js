require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    dialect: process.env.DB_DIALECT_LOCAL,
    port: process.env.DB_PORT_LOCAL,
  },

};
