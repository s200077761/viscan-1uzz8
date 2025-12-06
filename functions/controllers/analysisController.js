const admin = require('firebase-admin');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const irisProcessor = require('../services/irisProcessor');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Upload and analyze iris image
exports.upload = async (req, res) => {
  try {
    // Parse multipart form data
    const busboy = Busboy({headers: req.headers});
    const tmpdir = os.tmpdir();
    const uploads = {};

    busboy.on('file', (fieldname, file, info) => {
      const {filename, mimeType} = info;
      const filepath = path.join(tmpdir, filename);
      uploads[fieldname] = {filepath, mimeType};
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', async () => {
      try {
        if (!uploads.irisImage) {
          return res.status(400).json({
            success: false,
            message: 'No image file uploaded',
          });
        }

        const {filepath, mimeType} = uploads.irisImage;

        // Validate file type
        if (!mimeType.startsWith('image/')) {
          fs.unlinkSync(filepath);
          return res.status(400).json({
            success: false,
            message: 'File must be an image',
          });
        }

        // Process iris image
        const analysisResult = await irisProcessor.analyzeIris(filepath);

        // Upload to Firebase Storage
        const filename = `iris-images/${req.user.userId}/${Date.now()}.jpg`;
        await bucket.upload(filepath, {
          destination: filename,
          metadata: {
            contentType: mimeType,
            metadata: {
              userId: req.user.userId,
            },
          },
        });

        // Get public URL
        const file = bucket.file(filename);
        await file.makePublic();
        const imageUrl =
`https://storage.googleapis.com/${bucket.name}/${filename}`;

        // Save analysis to Firestore
        const analysisDoc = await db.collection('analyses').add({
          userId: req.user.userId,
          imageUrl,
          ...analysisResult,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Cleanup temp file
        fs.unlinkSync(filepath);

        res.status(200).json({
          success: true,
          message: 'Image analyzed successfully',
          analysis: {
            id: analysisDoc.id,
            imageUrl,
            ...analysisResult,
          },
        });
      } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
          success: false,
          message: 'Error analyzing image',
        });
      }
    });

    busboy.end(req.rawBody);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
    });
  }
};

// Get analysis history
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user analyses
    const analysesRef = db.collection('analyses');
    const query = analysesRef
        .where('userId', '==', req.user.userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(skip);

    const snapshot = await query.get();

    const analyses = [];
    snapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get total count
    const countQuery = await analysesRef
        .where('userId', '==', req.user.userId)
        .get();
    const total = countQuery.size;

    res.status(200).json({
      success: true,
      analyses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis history',
    });
  }
};

// Get single analysis
exports.getAnalysis = async (req, res) => {
  try {
    const {id} = req.params;

    const doc = await db.collection('analyses').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found',
      });
    }

    const analysis = doc.data();

    // Check ownership
    if (analysis.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this analysis',
      });
    }

    res.status(200).json({
      success: true,
      analysis: {
        id: doc.id,
        ...analysis,
      },
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis',
    });
  }
};

// Delete analysis
exports.deleteAnalysis = async (req, res) => {
  try {
    const {id} = req.params;

    const doc = await db.collection('analyses').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found',
      });
    }

    const analysis = doc.data();

    // Check ownership
    if (analysis.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis',
      });
    }

    // Delete image from Storage
    if (analysis.imageUrl) {
      const filename = analysis.imageUrl
          .split(`${bucket.name}/`)[1];
      await bucket.file(filename).delete().catch((err) => {
        console.error('Error deleting image:', err);
      });
    }

    // Delete from Firestore
    await db.collection('analyses').doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting analysis',
    });
  }
};

// Get all zones info
exports.getAllZones = async (req, res) => {
  try {
    const zonesData = require('../data/iridologyZones.json');

    res.status(200).json({
      success: true,
      zones: zonesData,
    });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching zones data',
    });
  }
};
