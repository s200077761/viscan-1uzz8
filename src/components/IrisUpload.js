// IrisUpload component for handling iris image uploads
class IrisUpload {
  constructor(app) {
    this.app = app;
  }
  
  createDropZone(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div id="dropZone" class="drop-zone">
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">📤</div>
          <h3 style="margin-bottom: 0.5rem;">Drop iris image here or click to upload</h3>
          <p style="color: var(--dark-text-muted); font-size: 0.875rem;">
            Supported formats: PNG, JPG, GIF (Max 5MB)
          </p>
        </div>
        <input type="file" id="dropZoneInput" accept="image/*" style="display: none;">
      </div>
      
      <div id="imagePreview" class="hidden" style="text-align: center;">
        <img id="previewImage" style="max-width: 100%; border-radius: 0.75rem; margin-bottom: 1rem;">
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button onclick="app.components.inputBox.irisUpload.removePreview()" class="btn btn-secondary">
            Remove
          </button>
          <button onclick="app.components.inputBox.irisUpload.uploadPreviewImage()" class="btn btn-primary">
            Analyze Image
          </button>
        </div>
      </div>
    `;
    
    const dropZone = document.getElementById('dropZone');
    const dropZoneInput = document.getElementById('dropZoneInput');
    
    // Click to upload
    dropZone.addEventListener('click', () => {
      dropZoneInput.click();
    });
    
    // File input change
    dropZoneInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files);
    });
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--iris-indigo)';
      dropZone.style.background = 'rgba(99, 102, 241, 0.1)';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
      this.handleFiles(e.dataTransfer.files);
    });
  }
  
  handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB.');
      return;
    }
    
    this.previewImage(file);
  }
  
  previewImage(file) {
    this.currentFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImage = document.getElementById('previewImage');
      const imagePreview = document.getElementById('imagePreview');
      const dropZone = document.getElementById('dropZone');
      
      if (previewImage && imagePreview && dropZone) {
        previewImage.src = e.target.result;
        imagePreview.classList.remove('hidden');
        dropZone.classList.add('hidden');
      }
    };
    reader.readAsDataURL(file);
  }
  
  removePreview() {
    this.currentFile = null;
    
    const imagePreview = document.getElementById('imagePreview');
    const dropZone = document.getElementById('dropZone');
    const dropZoneInput = document.getElementById('dropZoneInput');
    
    if (imagePreview && dropZone) {
      imagePreview.classList.add('hidden');
      dropZone.classList.remove('hidden');
    }
    
    if (dropZoneInput) {
      dropZoneInput.value = '';
    }
  }
  
  uploadPreviewImage() {
    if (this.currentFile) {
      window.dispatchEvent(new CustomEvent('uploadImage', {
        detail: this.currentFile
      }));
      this.removePreview();
    }
  }
  
  validateImage(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please upload an image.'));
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        reject(new Error('File size exceeds 5MB limit.'));
        return;
      }
      
      // Check image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width < 100 || img.height < 100) {
          reject(new Error('Image dimensions too small. Minimum 100x100 pixels.'));
          return;
        }
        
        resolve(true);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image.'));
      };
      
      img.src = objectUrl;
    });
  }
}

export default IrisUpload;
