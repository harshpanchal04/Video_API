// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

const Video = require('./video')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Video
};

