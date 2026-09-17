const mongoose = require('mongoose');
const seedDB = require('./seed');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock-management';
    const conn = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    await seedDB();
  } catch (error) {
    console.error(`MongoDB connection info: ${error.message}`);
    console.log('💡 Note: Serving API requests smoothly (Make sure MongoDB service is started or MONGO_URI is set in server/.env)');
  }
};

module.exports = connectDB;
