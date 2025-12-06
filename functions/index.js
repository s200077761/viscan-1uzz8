const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import routes
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Routes
app.use('/auth', authRoutes);
app.use('/analysis', analysisRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ViScan API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Export Express app as Cloud Function
exports.api = onRequest({
  timeoutSeconds: 60,
  memory: '512MiB',
}, app);
