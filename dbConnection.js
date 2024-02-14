const { Sequelize } = require('sequelize');
const config = require('./config/config');
let configValue;

  configValue = config.development;


const sequelize = new Sequelize(configValue.database, configValue.username, configValue.password, {
  host: configValue.host,
  dialect: configValue.dialect,
  port: configValue.port,
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 20000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    console.log('Logging DB Error💥💥💥', err);
    process.exit(1);
  });

module.exports = sequelize;
global.sequelize = sequelize;
