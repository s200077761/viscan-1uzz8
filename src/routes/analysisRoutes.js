const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const { protect } = require('../controllers/authController');
const {
  uploadAndAnalyze,
  getHistory,
  getAnalysisById,
  deleteAnalysis,
  getZones
} = require('../controllers/analysisController');

// All routes are protected (require authentication)

// Upload and analyze iris image
router.post('/upload', protect, upload.single('irisImage'), uploadAndAnalyze);

// Get analysis history
router.get('/history', protect, getHistory);

// Get specific analysis
router.get('/:id', protect, getAnalysisById);

// Delete analysis
router.delete('/:id', protect, deleteAnalysis);

// Get iridology zones information
router.get('/zones/all', protect, getZones);

module.exports = router;
