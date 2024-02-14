const Sequelize = require('sequelize');
const sequelize = require('../dbConnection');





const Task = sequelize.define('Task', {
  id: {
    type: Sequelize.BIGINT(20),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('todo', 'in-progress', 'done'),
    allowNull: false,
    defaultValue: 'todo', 

  },
  priority: {
    type: Sequelize.ENUM('low', 'medium', 'high'),
    allowNull: true,
    defaultValue: 'low', 

  },
  display_position: {
    type: Sequelize.INTEGER(11),
    allowNull: false,

  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Task.sync({alter:true})

module.exports = Task;