// Iris mapping utility functions
export const IRIS_ZONES = {
  // Zone definitions based on iridology mapping
  zones: [
    { id: 1, name: 'Brain', organ: 'Brain', color: '#8b5cf6', position: { angle: 0, radius: 0.5 } },
    { id: 2, name: 'Pituitary', organ: 'Pituitary Gland', color: '#6366f1', position: { angle: 0, radius: 0.3 } },
    { id: 3, name: 'Thyroid', organ: 'Thyroid', color: '#3b82f6', position: { angle: 30, radius: 0.5 } },
    { id: 4, name: 'Lungs', organ: 'Lungs', color: '#0ea5e9', position: { angle: 60, radius: 0.6 } },
    { id: 5, name: 'Heart', organ: 'Heart', color: '#ef4444', position: { angle: 120, radius: 0.6 } },
    { id: 6, name: 'Liver', organ: 'Liver', color: '#10b981', position: { angle: 150, radius: 0.7 } },
    { id: 7, name: 'Gallbladder', organ: 'Gallbladder', color: '#14b8a6', position: { angle: 165, radius: 0.7 } },
    { id: 8, name: 'Stomach', organ: 'Stomach', color: '#f59e0b', position: { angle: 180, radius: 0.4 } },
    { id: 9, name: 'Pancreas', organ: 'Pancreas', color: '#f97316', position: { angle: 195, radius: 0.5 } },
    { id: 10, name: 'Kidney', organ: 'Kidney', color: '#eab308', position: { angle: 225, radius: 0.7 } },
    { id: 11, name: 'Bladder', organ: 'Bladder', color: '#84cc16', position: { angle: 240, radius: 0.6 } },
    { id: 12, name: 'Intestines', organ: 'Intestines', color: '#22c55e', position: { angle: 270, radius: 0.5 } },
    { id: 13, name: 'Colon', organ: 'Colon', color: '#16a34a', position: { angle: 300, radius: 0.6 } },
    { id: 14, name: 'Spine', organ: 'Spine', color: '#6b7280', position: { angle: 330, radius: 0.4 } }
  ],
  
  getZoneByName(name) {
    return this.zones.find(z => z.name.toLowerCase() === name.toLowerCase());
  },
  
  getZoneById(id) {
    return this.zones.find(z => z.id === id);
  },
  
  getZoneColor(organ) {
    const zone = this.zones.find(z => z.organ.toLowerCase() === organ.toLowerCase());
    return zone ? zone.color : '#6366f1';
  }
};

export function drawIrisOverlay(canvas, imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Draw overlay
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 2 * 0.8;
      
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
      
      resolve();
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

export function getColorMeaning(color) {
  const meanings = {
    'brown': {
      constitution: 'Hematogenic',
      traits: 'Strong blood and endocrine system',
      tendencies: 'Blood-related conditions, liver sensitivity'
    },
    'blue': {
      constitution: 'Lymphatic',
      traits: 'Sensitive nervous system',
      tendencies: 'Mucous membrane issues, respiratory sensitivity'
    },
    'green': {
      constitution: 'Mixed',
      traits: 'Balanced characteristics',
      tendencies: 'Digestive and liver sensitivity'
    },
    'gray': {
      constitution: 'Connective Tissue',
      traits: 'Structural focus',
      tendencies: 'Joint and connective tissue concerns'
    }
  };
  
  return meanings[color.toLowerCase()] || null;
}

export default {
  IRIS_ZONES,
  drawIrisOverlay,
  getColorMeaning
};
