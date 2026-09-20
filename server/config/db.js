const mongoose = require('mongoose');
const dns = require('dns');
const seedDB = require('./seed');

// Resolve MongoDB Atlas SRV records using public DNS servers (fixes querySrv ECONNREFUSED on local/ISP DNS)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('DNS server override notice:', dnsErr.message);
}

let isConnected = false;
let retryTimer = null;

// Register listeners once on mongoose.connection
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log(`🍃 MongoDB Connected: ${mongoose.connection.host}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    isConnected = false;
    console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
    scheduleReconnect();
  }
});

const scheduleReconnect = () => {
  if (!retryTimer) {
    retryTimer = setTimeout(async () => {
      retryTimer = null;
      await connectDB();
    }, 10000);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock-management';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    await seedDB();
  } catch (error) {
    console.error(`MongoDB connection info: ${error.message}`);
    console.log('💡 Note: Retrying MongoDB connection in 10s. (Ensure MongoDB service is started or set MONGO_URI in server/.env)');
    scheduleReconnect();
  }
};

module.exports = connectDB;


