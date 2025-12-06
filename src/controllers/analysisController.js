const Analysis = require('../models/Analysis');
const irisProcessor = require('../services/irisProcessor');
const iridologyMapper = require('../services/iridologyMapper');
const path = require('path');
const fs = require('fs');

// Upload and analyze iris image
exports.uploadAndAnalyze = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an iris image'
      });
    }
    
    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Process the iris image
    console.log('Processing iris image...');
    const processedData = await irisProcessor.processImage(imagePath);
    
    // Analyze using iridology mapping
    console.log('Analyzing iris patterns...');
    const analysisResults = iridologyMapper.analyzeIris(processedData);
    
    // Save analysis to database
    const analysis = await Analysis.create({
      userId: req.user._id,
      imageUrl: imageUrl,
      originalFilename: req.file.originalname,
      analysisResults: {
        overallHealth: analysisResults.overallHealth,
        dominantColors: analysisResults.dominantColors,
        detectedPatterns: analysisResults.detectedPatterns,
        recommendations: analysisResults.recommendations
      },
      zoneData: analysisResults.zoneData
    });
    
    res.status(201).json({
      success: true,
      message: 'Iris analysis completed successfully',
      data: {
        analysisId: analysis._id,
        imageUrl: imageUrl,
        overallHealth: analysisResults.overallHealth,
        dominantColors: analysisResults.dominantColors,
        detectedPatterns: analysisResults.detectedPatterns,
        zoneData: analysisResults.zoneData,
        recommendations: analysisResults.recommendations,
        timestamp: analysis.timestamp
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing iris image'
    });
  }
};

// Get analysis history for user
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Analysis.countDocuments({ userId: req.user._id });
    
    res.status(200).json({
      success: true,
      data: {
        analyses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis history'
    });
  }
};

// Get specific analysis by ID
exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis'
    });
  }
};

// Delete analysis
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    // Delete associated image files
    const imagePath = path.join(__dirname, '../../', analysis.imageUrl);
    const enhancedPath = imagePath.replace(/(\.[\w\d_-]+)$/i, '-enhanced$1');
    
    try {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      if (fs.existsSync(enhancedPath)) fs.unlinkSync(enhancedPath);
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
    }
    
    // Delete from database
    await Analysis.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting analysis'
    });
  }
};

// Get iridology zones information
exports.getZones = async (req, res) => {
  try {
    const zones = iridologyMapper.getAllZones();
    
    res.status(200).json({
      success: true,
      data: zones
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching zones'
    });
  }
};
