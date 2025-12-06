const sharp = require('sharp');
const path = require('path');

class IrisProcessor {
  /**
   * Process uploaded iris image
   * @param {string} imagePath - Path to the uploaded image
   * @returns {Promise<Object>} Processed image data
   */
  async processImage(imagePath) {
    try {
      // Get image metadata
      const metadata = await sharp(imagePath).metadata();
      
      // Enhance image for better analysis
      const enhancedPath = imagePath.replace(/(\.[\w\d_-]+)$/i, '-enhanced$1');
      
      await sharp(imagePath)
        .resize(800, 800, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .normalize() // Enhance contrast
        .sharpen() // Sharpen details
        .toFile(enhancedPath);
      
      // Extract dominant colors
      const stats = await sharp(enhancedPath)
        .stats();
      
      // Extract color information
      const dominantColors = this.extractDominantColors(stats);
      
      // Detect patterns (simplified)
      const patterns = await this.detectPatterns(enhancedPath);
      
      return {
        originalPath: imagePath,
        enhancedPath: enhancedPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        },
        dominantColors,
        patterns,
        processed: true
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process iris image');
    }
  }
  
  /**
   * Extract dominant colors from image statistics
   * @param {Object} stats - Sharp.js image statistics
   * @returns {Array} Array of color objects
   */
  extractDominantColors(stats) {
    const colors = [];
    
    // Analyze RGB channels
    const channels = ['red', 'green', 'blue'];
    channels.forEach((channel, index) => {
      const channelStats = stats.channels[index];
      const intensity = channelStats.mean;
      
      // Determine color interpretation based on intensity and channel
      let colorName = 'neutral';
      let interpretation = 'Normal iris coloring';
      
      if (channel === 'blue' && intensity > 150) {
        colorName = 'blue';
        interpretation = 'Blue tones may indicate lymphatic constitution';
      } else if (channel === 'green' && intensity > 130) {
        colorName = 'green';
        interpretation = 'Green tones suggest balanced constitution';
      } else if (channel === 'red' && intensity > 140) {
        colorName = 'brown';
        interpretation = 'Brown tones indicate hematogenic constitution';
      }
      
      if (intensity > 120) {
        colors.push({
          color: colorName,
          channel: channel,
          intensity: Math.round(intensity),
          percentage: Math.round((intensity / 255) * 100),
          interpretation: interpretation
        });
      }
    });
    
    return colors.length > 0 ? colors : [{
      color: 'mixed',
      interpretation: 'Mixed iris coloring - balanced constitution'
    }];
  }
  
  /**
   * Detect patterns in iris (simplified pattern detection)
   * @param {string} imagePath - Path to enhanced image
   * @returns {Promise<Array>} Array of detected patterns
   */
  async detectPatterns(imagePath) {
    try {
      // Get image statistics for pattern detection
      const { dominant, contrast } = await sharp(imagePath)
        .stats()
        .then(stats => ({
          dominant: stats.dominant,
          contrast: stats.channels[0].stdev // Standard deviation as contrast indicator
        }));
      
      const patterns = [];
      
      // High contrast might indicate lines or radial patterns
      if (contrast > 40) {
        patterns.push({
          type: 'radial-lines',
          location: 'throughout',
          significance: 'May indicate nerve activity or stress patterns'
        });
      }
      
      // Add default observation
      if (patterns.length === 0) {
        patterns.push({
          type: 'clear',
          location: 'general',
          significance: 'Relatively clear iris structure'
        });
      }
      
      return patterns;
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return [{
        type: 'unknown',
        location: 'general',
        significance: 'Unable to detect specific patterns'
      }];
    }
  }
  
  /**
   * Create circular zone mapping overlay (for future use)
   * @param {string} imagePath - Original image path
   * @returns {Promise<string>} Path to annotated image
   */
  async createZoneOverlay(imagePath) {
    // This would create a visual overlay showing iridology zones
    // For now, we'll return the original path
    // In a full implementation, this would use SVG or canvas drawing
    return imagePath;
  }
}

module.exports = new IrisProcessor();
