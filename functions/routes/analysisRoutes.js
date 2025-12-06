const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// POST /api/analysis/upload - Upload and analyze iris image
router.post('/upload', analysisController.upload);

// GET /api/analysis/history - Get analysis history
router.get('/history', analysisController.getHistory);

// GET /api/analysis/:id - Get single analysis
router.get('/:id', analysisController.getAnalysis);

// DELETE /api/analysis/:id - Delete analysis
router.delete('/:id', analysisController.deleteAnalysis);

// GET /api/analysis/zones/all - Get all zones info
router.get('/zones/all', analysisController.getAllZones);

module.exports = router;
