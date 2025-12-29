// IrisResultCard component for displaying analysis results with visualization
class IrisResultCard {
  constructor(analysisData) {
    this.analysisData = analysisData;
  }
  
  render() {
    const { overallHealth, dominantColors, detectedPatterns, zoneData, recommendations, imageUrl } = this.analysisData;
    
    return `
      <div class="iris-result-card">
        <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.5rem;">🔍</span>
          Iris Analysis Visualization
        </h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <!-- Iris Image with Canvas Overlay -->
          <div>
            <h4 style="margin-bottom: 1rem;">Iris Scan</h4>
            <div style="position: relative; display: inline-block;">
              <img src="${imageUrl}" alt="Iris" 
                style="max-width: 100%; border-radius: 0.75rem; border: 2px solid var(--iris-indigo);">
              <canvas id="irisCanvas" class="iris-overlay-canvas" 
                style="position: absolute; top: 0; left: 0; pointer-events: none;">
              </canvas>
            </div>
          </div>
          
          <!-- Color and Pattern Analysis -->
          <div>
            <h4 style="margin-bottom: 1rem;">Analysis Summary</h4>
            
            <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Overall Health</div>
              <div style="font-size: 1.25rem; color: var(--chatgpt-green);">${overallHealth}</div>
            </div>
            
            ${dominantColors && dominantColors.length > 0 ? `
              <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">Dominant Colors</div>
                ${this.renderColors(dominantColors)}
              </div>
            ` : ''}
            
            ${detectedPatterns && detectedPatterns.length > 0 ? `
              <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">Detected Patterns</div>
                <div style="font-size: 0.875rem;">
                  ${detectedPatterns.map(p => `<div style="margin-bottom: 0.25rem;">• ${p}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        
        ${zoneData && zoneData.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem;">Zone Analysis</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem;">
              ${this.renderZones(zoneData)}
            </div>
          </div>
        ` : ''}
        
        ${recommendations && recommendations.length > 0 ? `
          <div>
            <h4 style="margin-bottom: 1rem;">💡 Recommendations</h4>
            <div style="background: rgba(16, 163, 127, 0.1); border: 1px solid var(--chatgpt-green); padding: 1rem; border-radius: 0.5rem;">
              ${recommendations.map(rec => `
                <div style="margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative;">
                  <span style="position: absolute; left: 0;">✓</span>
                  ${rec}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  renderColors(colors) {
    return `
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
        ${colors.map(color => `
          <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 0.75rem; border-radius: 0.5rem;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background: ${color.hex || this.getColorHex(color.name)}; border: 1px solid rgba(255,255,255,0.3);"></div>
            <span style="font-size: 0.875rem;">${color.name}</span>
            ${color.percentage ? `<span style="font-size: 0.75rem; color: var(--dark-text-muted);">${color.percentage}%</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  renderZones(zones) {
    return zones.slice(0, 12).map(zone => `
      <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 0.5rem; border-left: 3px solid ${this.getZoneColor(zone.organ)};">
        <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">${zone.organ}</div>
        <div style="font-size: 0.75rem; color: var(--dark-text-muted);">
          ${zone.status || 'Normal'}
        </div>
      </div>
    `).join('');
  }
  
  getColorHex(colorName) {
    const colorMap = {
      'brown': '#8B4513',
      'blue': '#4169E1',
      'green': '#228B22',
      'gray': '#808080',
      'yellow': '#FFD700',
      'amber': '#FFBF00'
    };
    return colorMap[colorName.toLowerCase()] || '#6366f1';
  }
  
  getZoneColor(organ) {
    const zoneColors = {
      'Heart': 'var(--zone-heart)',
      'Brain': 'var(--zone-brain)',
      'Lungs': 'var(--zone-lungs)',
      'Liver': 'var(--zone-liver)',
      'Kidney': 'var(--zone-kidney)',
      'Stomach': '#f59e0b',
      'Intestines': '#10b981',
      'Thyroid': '#8b5cf6'
    };
    return zoneColors[organ] || 'var(--iris-indigo)';
  }
  
  initializeCanvas() {
    const canvas = document.getElementById('irisCanvas');
    if (!canvas) return;
    
    const img = canvas.previousElementSibling;
    if (!img || !img.complete) {
      // Wait for image to load
      if (img) {
        img.onload = () => this.drawOverlay(canvas, img);
      }
      return;
    }
    
    this.drawOverlay(canvas, img);
  }
  
  drawOverlay(canvas, img) {
    // Set canvas size to match image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    canvas.style.width = img.offsetWidth + 'px';
    canvas.style.height = img.offsetHeight + 'px';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw iris zone circles
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 * 0.8;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw concentric circles for zones
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 2;
    
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * (i / 3), 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw radial lines for sectors
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + maxRadius * Math.cos(angle),
        centerY + maxRadius * Math.sin(angle)
      );
      ctx.stroke();
    }
    
    // Draw center pupil circle
    ctx.strokeStyle = 'rgba(16, 163, 127, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.15, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

export default IrisResultCard;
