const mongoose = require('mongoose');
const seedDB = require('./seed');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock-management';

  mongoose.connection.on('connected', () => {
    console.log(`🍃 MongoDB Connected successfully to ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  });

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    await seedDB();
  } catch (error) {
    console.error(`MongoDB connection info: ${error.message}`);
    console.log('💡 Note: Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

