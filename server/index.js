const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/advances', require('./routes/advanceRoutes'));
app.use('/api/transactions', require('./routes/stockTransactionRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/dispatches', require('./routes/dispatchRoutes'));

const path = require('path');
const fs = require('fs');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Stock Management API is running', status: 'Healthy', port: process.env.PORT || 5000 });
});

// Serve frontend build if present (for single-service deployment)
const frontendDist = path.join(__dirname, '../src/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Standalone backend root health check
  app.get('/', (req, res) => {
    res.json({ message: 'Stock Management API is running', status: 'Healthy', port: process.env.PORT || 5000 });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Stock Management Backend Server running on port ${PORT}`);
});
