// ChatArea component for displaying messages
import MessageBubble from './MessageBubble.js';
import IrisResultCard from './IrisResultCard.js';

class ChatArea {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('chatArea');
    this.messages = [];
  }
  
  render() {
    if (this.app.state.user) {
      this.showWelcome();
    }
  }
  
  showWelcome() {
    this.container.innerHTML = `
      <div class="welcome-screen">
        <h1>👁️ ViScan Iris Analysis</h1>
        <p>Upload an iris image to get AI-powered health insights</p>
        <div style="margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; max-width: 600px;">
          <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid var(--iris-indigo); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 200px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🗺️</div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">Zone Mapping</div>
            <div style="font-size: 0.875rem; color: var(--dark-text-muted);">Analyze 20+ iris zones</div>
          </div>
          <div style="background: rgba(16, 163, 127, 0.1); border: 1px solid var(--chatgpt-green); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 200px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎨</div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">Color Analysis</div>
            <div style="font-size: 0.875rem; color: var(--dark-text-muted);">Detect dominant colors</div>
          </div>
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 200px;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">Pattern Detection</div>
            <div style="font-size: 0.875rem; color: var(--dark-text-muted);">Identify iris patterns</div>
          </div>
        </div>
      </div>
    `;
  }
  
  clearMessages() {
    this.messages = [];
    this.container.innerHTML = '';
  }
  
  addMessage(message) {
    this.messages.push(message);
    
    // Remove welcome screen if present
    const welcomeScreen = this.container.querySelector('.welcome-screen');
    if (welcomeScreen) {
      welcomeScreen.remove();
    }
    
    // Create message bubble
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-container';
    
    const bubble = new MessageBubble(message, this.app);
    messageDiv.innerHTML = bubble.render();
    
    this.container.appendChild(messageDiv);
    
    // Scroll to bottom
    this.scrollToBottom();
    
    // If message has analysis data, render iris result card
    if (message.analysisData) {
      const irisCard = new IrisResultCard(message.analysisData);
      const cardDiv = document.createElement('div');
      cardDiv.className = 'message-container';
      cardDiv.innerHTML = irisCard.render();
      this.container.appendChild(cardDiv);
      
      // Initialize canvas if present
      setTimeout(() => {
        irisCard.initializeCanvas();
      }, 100);
      
      this.scrollToBottom();
    }
  }
  
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message-container';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="message-bubble message-assistant">
        <div class="message-header">
          <div class="message-avatar" style="background: var(--iris-indigo);">🤖</div>
          <span>ViScan AI</span>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    this.container.appendChild(typingDiv);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  loadConversation(conversation) {
    this.clearMessages();
    
    if (conversation.messages && conversation.messages.length > 0) {
      conversation.messages.forEach(message => {
        this.addMessage(message);
      });
    } else {
      this.showWelcome();
    }
    
    // Update header title
    if (this.app.components.header) {
      this.app.components.header.updateTitle(conversation.title);
    }
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.container.scrollTop = this.container.scrollHeight;
    }, 100);
  }
}

export default ChatArea;
