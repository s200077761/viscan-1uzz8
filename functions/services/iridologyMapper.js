const iridologyZones = require('../data/iridologyZones.json');

class IridologyMapper {
  constructor() {
    this.zones = iridologyZones;
  }
  
  /**
   * Analyze iris based on processed image data
   * @param {Object} processedData - Data from irisProcessor
   * @returns {Object} Analysis results with zone mapping
   */
  analyzeIris(processedData) {
    const { dominantColors, patterns } = processedData;
    
    // Map dominant colors to zones
    const zoneData = this.mapColorsToZones(dominantColors);
    
    // Analyze patterns across zones
    const patternAnalysis = this.analyzePatterns(patterns);
    
    // Generate overall health assessment
    const overallHealth = this.assessOverallHealth(zoneData);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(zoneData, overallHealth);
    
    return {
      overallHealth,
      dominantColors,
      detectedPatterns: patterns,
      zoneData,
      recommendations
    };
  }
  
  /**
   * Map detected colors to iridology zones
   * @param {Array} colors - Dominant colors from image processing
   * @returns {Array} Zone data with health interpretations
   */
  mapColorsToZones(colors) {
    const zoneData = [];
    
    // For demonstration, we'll analyze a subset of zones
    // In a full implementation, this would use computer vision to map exact locations
    const primaryZones = this.zones.slice(0, 10); // Analyze first 10 zones
    
    primaryZones.forEach(zone => {
      // Determine health status based on color analysis
      const healthStatus = this.determineZoneHealth(colors, zone);
      
      // Select appropriate interpretation
      const interpretation = zone.healthIndicators[healthStatus];
      
      // Determine detected color for this zone (simplified)
      const detectedColor = colors.length > 0 ? colors[0].color : 'normal';
      
      zoneData.push({
        zoneId: zone.id,
        zoneName: zone.name,
        bodyOrgan: zone.bodyOrgan,
        clockPosition: zone.clockPosition,
        detectedColor: detectedColor,
        detectedPatterns: ['analyzed'],
        healthStatus: healthStatus,
        interpretation: interpretation
      });
    });
    
    return zoneData;
  }
  
  /**
   * Determine health status for a zone
   * @param {Array} colors - Detected colors
   * @param {Object} zone - Zone information
   * @returns {string} Health status: normal, attention, or concern
   */
  determineZoneHealth(colors, zone) {
    // Simplified logic - in reality would analyze specific zone regions
    if (colors.length === 0) return 'normal';
    
    // Random-ish distribution for demo (would be actual analysis in production)
    const avgIntensity = colors.reduce((sum, c) => sum + (c.intensity || 128), 0) / colors.length;
    
    if (avgIntensity < 100) {
      return 'concern';
    } else if (avgIntensity < 150) {
      return 'attention';
    } else {
      return 'normal';
    }
  }
  
  /**
   * Analyze patterns detected in the iris
   * @param {Array} patterns - Detected patterns
   * @returns {Object} Pattern analysis
   */
  analyzePatterns(patterns) {
    const analysis = {
      totalPatterns: patterns.length,
      significantPatterns: patterns.filter(p => p.type !== 'clear').length,
      interpretation: ''
    };
    
    if (analysis.significantPatterns === 0) {
      analysis.interpretation = 'Clear iris with minimal markings - generally positive';
    } else if (analysis.significantPatterns <= 2) {
      analysis.interpretation = 'Some patterns detected - may indicate normal variations';
    } else {
      analysis.interpretation = 'Multiple patterns detected - consider detailed evaluation';
    }
    
    return analysis;
  }
  
  /**
   * Assess overall health based on zone analysis
   * @param {Array} zoneData - Analyzed zone data
   * @returns {string} Overall health rating
   */
  assessOverallHealth(zoneData) {
    const statusCounts = {
      normal: 0,
      attention: 0,
      concern: 0
    };
    
    zoneData.forEach(zone => {
      statusCounts[zone.healthStatus]++;
    });
    
    const total = zoneData.length;
    const normalPercentage = (statusCounts.normal / total) * 100;
    
    if (normalPercentage >= 80) {
      return 'excellent';
    } else if (normalPercentage >= 60) {
      return 'good';
    } else if (normalPercentage >= 40) {
      return 'fair';
    } else {
      return 'needs-attention';
    }
  }
  
  /**
   * Generate health recommendations
   * @param {Array} zoneData - Analyzed zone data
   * @param {string} overallHealth - Overall health assessment
   * @returns {Array} Recommendations
   */
  generateRecommendations(zoneData, overallHealth) {
    const recommendations = [];
    
    // General disclaimer
    recommendations.push('⚠️ This analysis is for informational purposes only and not a medical diagnosis');
    
    // Count zones needing attention
    const attentionZones = zoneData.filter(z => z.healthStatus === 'attention' || z.healthStatus === 'concern');
    
    if (attentionZones.length > 0) {
      recommendations.push(`${attentionZones.length} zone(s) show patterns that may benefit from attention`);
      
      // Mention specific organs
      const organs = [...new Set(attentionZones.map(z => z.bodyOrgan))];
      if (organs.length > 0) {
        recommendations.push(`Areas of interest: ${organs.slice(0, 3).join(', ')}`);
      }
    }
    
    // Lifestyle recommendations based on overall health
    if (overallHealth === 'excellent') {
      recommendations.push('✅ Maintain current healthy lifestyle habits');
    } else if (overallHealth === 'good') {
      recommendations.push('💚 Consider stress reduction and balanced nutrition');
    } else if (overallHealth === 'fair') {
      recommendations.push('💛 Focus on rest, hydration, and balanced diet');
    } else {
      recommendations.push('🔶 Consider consulting a healthcare professional for comprehensive evaluation');
    }
    
    recommendations.push('💧 Stay hydrated and maintain regular sleep patterns');
    recommendations.push('🥗 Consider incorporating more whole foods and vegetables');
    
    return recommendations;
  }
  
  /**
   * Get zone information by ID
   * @param {number} zoneId - Zone ID
   * @returns {Object} Zone information
   */
  getZoneById(zoneId) {
    return this.zones.find(z => z.id === zoneId);
  }
  
  /**
   * Get all zones
   * @returns {Array} All iridology zones
   */
  getAllZones() {
    return this.zones;
  }
}

module.exports = new IridologyMapper();
