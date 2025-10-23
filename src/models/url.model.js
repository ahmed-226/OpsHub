const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database'); 

class Url extends Model {}

Url.init({
  shortCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  originalUrl: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
}, {
  sequelize, 
  modelName: 'Url', 
  tableName: 'urls',
  indexes: [
    {
      fields: ['originalUrl']
    }
  ]
});

module.exports = Url;