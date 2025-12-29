// InputBox component for message input and image upload
import IrisUpload from './IrisUpload.js';

class InputBox {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('inputBox');
    this.irisUpload = new IrisUpload(app);
  }
  
  render() {
    this.container.innerHTML = `
      <div class="input-wrapper">
        <button class="upload-button" onclick="app.components.inputBox.triggerImageUpload()" 
          title="Upload iris image">
          📷
        </button>
        <textarea 
          id="messageInput" 
          class="chat-input" 
          placeholder="Ask about iris analysis or upload an image..." 
          rows="1"
          style="padding-left: 3.5rem;"
        ></textarea>
        <button class="send-button" id="sendButton" onclick="app.components.inputBox.sendMessage()" 
          title="Send message">
          ➤
        </button>
        <input type="file" id="imageUploadInput" accept="image/*" style="display: none;">
      </div>
    `;
    
    // Setup auto-expanding textarea
    const textarea = document.getElementById('messageInput');
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.autoExpand(textarea);
      });
      
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    // Setup image upload
    const imageInput = document.getElementById('imageUploadInput');
    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        this.handleImageSelect(e);
      });
    }
    
    // Enable/disable send button based on input
    this.updateSendButton();
  }
  
  autoExpand(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    this.updateSendButton();
  }
  
  updateSendButton() {
    const textarea = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (textarea && sendButton) {
      const hasContent = textarea.value.trim().length > 0;
      sendButton.disabled = !hasContent;
    }
  }
  
  sendMessage() {
    const textarea = document.getElementById('messageInput');
    if (!textarea) return;
    
    const message = textarea.value.trim();
    if (!message) return;
    
    // Dispatch send message event
    window.dispatchEvent(new CustomEvent('sendMessage', {
      detail: message
    }));
    
    // Clear input
    textarea.value = '';
    textarea.style.height = 'auto';
    this.updateSendButton();
    
    // Focus back on textarea
    textarea.focus();
  }
  
  triggerImageUpload() {
    const imageInput = document.getElementById('imageUploadInput');
    if (imageInput) {
      imageInput.click();
    }
  }
  
  handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB.');
      return;
    }
    
    // Dispatch upload event
    window.dispatchEvent(new CustomEvent('uploadImage', {
      detail: file
    }));
    
    // Clear input
    event.target.value = '';
  }
  
  setPlaceholder(text) {
    const textarea = document.getElementById('messageInput');
    if (textarea) {
      textarea.placeholder = text;
    }
  }
  
  disable() {
    const textarea = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const uploadButton = document.querySelector('.upload-button');
    
    if (textarea) textarea.disabled = true;
    if (sendButton) sendButton.disabled = true;
    if (uploadButton) uploadButton.disabled = true;
  }
  
  enable() {
    const textarea = document.getElementById('messageInput');
    const uploadButton = document.querySelector('.upload-button');
    
    if (textarea) textarea.disabled = false;
    if (uploadButton) uploadButton.disabled = false;
    this.updateSendButton();
  }
}

export default InputBox;
