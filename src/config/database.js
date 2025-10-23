const { Sequelize } = require('sequelize');
const path = require('path');

const DB_DIR = '/app/data';
const DB_FILE = process.env.DB_FILE || path.join(DB_DIR, 'url_shortener.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_FILE,
  logging: process.env.NODE_ENV !== 'production' 
});

const initializeDatabase = async () => {
  try {
    const fs = require('fs');
    const dbDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
    console.log(`Database file location: ${DB_FILE}`);
    
    require('../models/url.model');
    
    await sequelize.sync({ alter: true }); 
    console.log('Database & tables synced.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeDatabase();
module.exports = sequelize;