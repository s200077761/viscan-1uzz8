// Global variables
let selectedFile = null;
let currentAnalysis = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  const user = getUser();
  
  if (!token) {
    window.location.href = 'auth.html';
    return;
  }
  
  // Display user welcome message
  if (user) {
    document.getElementById('userWelcome').textContent = `مرحباً، ${user.username}`;
  }
  
  // Setup file upload
  setupFileUpload();
  
  // Load analysis history
  loadHistory();
});

// Setup file upload functionality
function setupFileUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  
  // Click to upload
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });
  
  // File selection
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });
  
  // Drag and drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });
}

// Handle file selection
function handleFileSelect(file) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification('يرجى اختيار ملف صورة', 'warning');
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('حجم الملف يجب أن يكون أقل من 5MB', 'warning');
    return;
  }
  
  selectedFile = file;
  
  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('previewImage').src = e.target.result;
    document.getElementById('dropZone').classList.add('hidden');
    document.getElementById('imagePreview').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

// Remove selected image
function removeImage() {
  selectedFile = null;
  document.getElementById('dropZone').classList.remove('hidden');
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('fileInput').value = '';
}

// Analyze image
async function analyzeImage() {
  if (!selectedFile) {
    showNotification('يرجى اختيار صورة أولاً', 'warning');
    return;
  }
  
  const token = getToken();
  const formData = new FormData();
  formData.append('irisImage', selectedFile);
  
  // Show progress
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('analysisProgress').classList.remove('hidden');
  
  try {
    const response = await fetch(`${API_URL}/analysis/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentAnalysis = data.data;
      displayResults(data.data);
      loadHistory(); // Refresh history
      showNotification('تم التحليل بنجاح! 🎉', 'info');
      
      // Reset upload
      removeImage();
      document.getElementById('analysisProgress').classList.add('hidden');
      document.getElementById('dropZone').classList.remove('hidden');
    } else {
      throw new Error(data.message || 'فشل التحليل');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    showNotification(error.message || 'حدث خطأ أثناء التحليل', 'warning');
    document.getElementById('analysisProgress').classList.add('hidden');
    document.getElementById('imagePreview').classList.remove('hidden');
  }
}

// Display analysis results
function displayResults(data) {
  // Show results section
  document.getElementById('resultsSection').classList.remove('hidden');
  
  // Scroll to results
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
  
  // Display overall health
  const healthEmoji = getHealthEmoji(data.overallHealth);
  const healthText = getHealthText(data.overallHealth);
  document.getElementById('healthEmoji').textContent = healthEmoji;
  document.getElementById('healthStatus').textContent = healthText;
  
  // Display dominant colors
  const colorsContainer = document.getElementById('colorsContainer');
  colorsContainer.innerHTML = '';
  
  data.dominantColors.forEach(color => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    colorItem.innerHTML = `
      <div class="color-swatch" style="background: ${color.color}"></div>
      <div class="color-info">
        <strong>${color.color}</strong>
        <small>${color.interpretation || 'تحليل الألوان'}</small>
      </div>
    `;
    colorsContainer.appendChild(colorItem);
  });
  
  // Display patterns
  const patternsContainer = document.getElementById('patternsContainer');
  patternsContainer.innerHTML = '';
  
  data.detectedPatterns.forEach(pattern => {
    const patternItem = document.createElement('div');
    patternItem.className = 'pattern-item';
    patternItem.innerHTML = `
      <strong>${pattern.type}</strong>
      <small>${pattern.significance}</small>
    `;
    patternsContainer.appendChild(patternItem);
  });
  
  // Display zone mapping
  const zoneMapping = document.getElementById('zoneMapping');
  zoneMapping.innerHTML = '';
  
  data.zoneData.forEach(zone => {
    const zoneItem = document.createElement('div');
    zoneItem.className = 'zone-item';
    const zoneColor = getZoneColor(zone.healthStatus);
    
    zoneItem.innerHTML = `
      <div class="zone-header">
        <span class="zone-name">${zone.zoneName}</span>
        <div class="zone-status" style="background-color: ${zoneColor}"></div>
      </div>
      <div class="zone-organ">${zone.bodyOrgan} - ${zone.clockPosition}</div>
      <div class="zone-interpretation">${zone.interpretation}</div>
    `;
    zoneMapping.appendChild(zoneItem);
  });
  
  // Display recommendations
  const recommendationsContainer = document.getElementById('recommendationsContainer');
  recommendationsContainer.innerHTML = '';
  
  data.recommendations.forEach(rec => {
    const recItem = document.createElement('div');
    recItem.className = 'recommendation-item';
    recItem.textContent = rec;
    recommendationsContainer.appendChild(recItem);
  });
}

// Load analysis history
async function loadHistory() {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_URL}/analysis/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success && data.data.analyses.length > 0) {
      displayHistory(data.data.analyses);
    } else {
      document.getElementById('historyEmpty').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Display history
function displayHistory(analyses) {
  const historyContainer = document.getElementById('historyContainer');
  historyContainer.innerHTML = '';
  document.getElementById('historyEmpty').classList.add('hidden');
  
  analyses.forEach(analysis => {
    const card = document.createElement('div');
    card.className = 'history-card';
    
    const healthEmoji = getHealthEmoji(analysis.analysisResults.overallHealth);
    const healthText = getHealthText(analysis.analysisResults.overallHealth);
    
    card.innerHTML = `
      <img src="${analysis.imageUrl}" alt="Iris scan" class="history-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22200%22/><text fill=%22%23667eea%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22>صورة القزحية</text></svg>'">
      <div class="history-content">
        <div class="history-date">${formatDate(analysis.timestamp)}</div>
        <div class="history-status">
          <span>${healthEmoji}</span>
          <span>${healthText}</span>
        </div>
        <div class="history-actions">
          <button class="btn btn-primary" onclick="viewAnalysis('${analysis._id}')">عرض</button>
          <button class="btn btn-secondary" onclick="deleteAnalysis('${analysis._id}')">حذف</button>
        </div>
      </div>
    `;
    
    historyContainer.appendChild(card);
  });
}

// View specific analysis
async function viewAnalysis(id) {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_URL}/analysis/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayResults(data.data);
    }
  } catch (error) {
    console.error('Error viewing analysis:', error);
    showNotification('حدث خطأ أثناء عرض التحليل', 'warning');
  }
}

// Delete analysis
async function deleteAnalysis(id) {
  if (!confirm('هل أنت متأكد من حذف هذا التحليل؟')) {
    return;
  }
  
  const token = getToken();
  
  try {
    const response = await fetch(`${API_URL}/analysis/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      showNotification('تم حذف التحليل بنجاح', 'info');
      loadHistory();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
    showNotification('حدث خطأ أثناء حذف التحليل', 'warning');
  }
}
