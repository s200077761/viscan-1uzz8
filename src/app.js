// Main application entry point
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import ChatArea from './components/ChatArea.js';
import InputBox from './components/InputBox.js';
import Settings from './components/Settings.js';
import MCPClient from './mcp/MCPClient.js';

class ViScanApp {
  constructor() {
    this.components = {};
    this.state = {
      theme: localStorage.getItem('theme') || 'dark',
      currentConversation: null,
      conversations: [],
      mcpConnected: false,
      user: null
    };
    
    this.init();
  }
  
  async init() {
    // Check authentication
    await this.checkAuth();
    
    // Apply theme
    this.applyTheme();
    
    // Initialize MCP Client
    this.mcpClient = new MCPClient();
    await this.initializeMCP();
    
    // Initialize components
    this.initializeComponents();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load conversation history
    await this.loadConversations();
  }
  
  async checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      // Show login prompt
      this.showLoginPrompt();
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.state.user = data.user;
      } else {
        localStorage.removeItem('token');
        this.showLoginPrompt();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.showLoginPrompt();
    }
  }
  
  showLoginPrompt() {
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
      <div class="welcome-screen">
        <h1>👁️ Welcome to ViScan</h1>
        <p>Advanced Iris Analysis with AI-powered insights</p>
        <div style="margin-top: 2rem;">
          <button onclick="app.showLogin()" class="btn btn-primary" style="margin-right: 1rem;">
            Login
          </button>
          <button onclick="app.showRegister()" class="btn btn-secondary">
            Register
          </button>
        </div>
      </div>
    `;
  }
  
  showLogin() {
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
      <div class="welcome-screen">
        <h2>Login to ViScan</h2>
        <form id="loginForm" style="max-width: 400px; margin-top: 2rem;">
          <div style="margin-bottom: 1rem;">
            <input type="email" id="loginEmail" placeholder="Email" 
              class="chat-input" style="padding: 0.75rem;" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <input type="password" id="loginPassword" placeholder="Password" 
              class="chat-input" style="padding: 0.75rem;" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Login
          </button>
          <div style="margin-top: 1rem; text-align: center;">
            <a href="#" onclick="app.showRegister(); return false;" 
              style="color: var(--chatgpt-green);">
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });
  }
  
  showRegister() {
    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
      <div class="welcome-screen">
        <h2>Register for ViScan</h2>
        <form id="registerForm" style="max-width: 400px; margin-top: 2rem;">
          <div style="margin-bottom: 1rem;">
            <input type="text" id="registerUsername" placeholder="Username" 
              class="chat-input" style="padding: 0.75rem;" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <input type="email" id="registerEmail" placeholder="Email" 
              class="chat-input" style="padding: 0.75rem;" required>
          </div>
          <div style="margin-bottom: 1rem;">
            <input type="password" id="registerPassword" placeholder="Password" 
              class="chat-input" style="padding: 0.75rem;" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">
            Register
          </button>
          <div style="margin-top: 1rem; text-align: center;">
            <a href="#" onclick="app.showLogin(); return false;" 
              style="color: var(--chatgpt-green);">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });
  }
  
  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.state.user = data.user;
        window.location.reload();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }
  
  async handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.state.user = data.user;
        window.location.reload();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }
  
  applyTheme() {
    if (this.state.theme === 'light') {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }
  }
  
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.state.theme);
    this.applyTheme();
  }
  
  async initializeMCP() {
    try {
      const connected = await this.mcpClient.connect();
      this.state.mcpConnected = connected;
      this.updateMCPStatus();
    } catch (error) {
      console.error('MCP initialization failed:', error);
      this.state.mcpConnected = false;
      this.updateMCPStatus();
    }
  }
  
  updateMCPStatus() {
    const statusElement = document.getElementById('mcpStatus');
    if (statusElement) {
      if (this.state.mcpConnected) {
        statusElement.className = 'mcp-status connected';
        statusElement.innerHTML = `
          <div class="mcp-status-dot"></div>
          <span>MCP Connected</span>
        `;
      } else {
        statusElement.className = 'mcp-status disconnected';
        statusElement.innerHTML = `
          <div class="mcp-status-dot"></div>
          <span>MCP Disconnected</span>
        `;
      }
    }
  }
  
  initializeComponents() {
    // Initialize Sidebar
    this.components.sidebar = new Sidebar(this);
    
    // Initialize Header
    this.components.header = new Header(this);
    
    // Initialize Chat Area
    this.components.chatArea = new ChatArea(this);
    
    // Initialize Input Box
    this.components.inputBox = new InputBox(this);
    
    // Initialize Settings
    this.components.settings = new Settings(this);
    
    // Render all components
    this.renderComponents();
  }
  
  renderComponents() {
    this.components.sidebar.render();
    this.components.header.render();
    this.components.chatArea.render();
    this.components.inputBox.render();
  }
  
  setupEventListeners() {
    // Theme toggle
    window.addEventListener('themeToggle', () => {
      this.toggleTheme();
    });
    
    // Settings modal
    window.addEventListener('openSettings', () => {
      this.components.settings.open();
    });
    
    // Message send
    window.addEventListener('sendMessage', (e) => {
      this.handleSendMessage(e.detail);
    });
    
    // Image upload
    window.addEventListener('uploadImage', (e) => {
      this.handleImageUpload(e.detail);
    });
    
    // New conversation
    window.addEventListener('newConversation', () => {
      this.startNewConversation();
    });
  }
  
  async loadConversations() {
    if (!this.state.user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analysis/history?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.state.conversations = data.data.analyses.map(analysis => ({
          id: analysis._id,
          title: this.generateConversationTitle(analysis),
          timestamp: analysis.timestamp,
          messages: this.convertAnalysisToMessages(analysis)
        }));
        
        // Update sidebar
        if (this.components.sidebar) {
          this.components.sidebar.updateConversations(this.state.conversations);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }
  
  generateConversationTitle(analysis) {
    const date = new Date(analysis.timestamp);
    return `Iris Scan - ${date.toLocaleDateString()}`;
  }
  
  convertAnalysisToMessages(analysis) {
    const messages = [];
    
    // User message (image upload)
    messages.push({
      role: 'user',
      content: `I've uploaded an iris image for analysis.`,
      timestamp: analysis.timestamp,
      image: analysis.imageUrl
    });
    
    // Assistant response (analysis results)
    messages.push({
      role: 'assistant',
      content: this.formatAnalysisResults(analysis),
      timestamp: analysis.timestamp,
      analysisData: analysis
    });
    
    return messages;
  }
  
  formatAnalysisResults(analysis) {
    let markdown = `# Iris Analysis Results\n\n`;
    markdown += `**Overall Health:** ${analysis.analysisResults.overallHealth}\n\n`;
    
    if (analysis.analysisResults.dominantColors) {
      markdown += `## Dominant Colors\n`;
      analysis.analysisResults.dominantColors.forEach(color => {
        markdown += `- ${color.name}: ${color.percentage}%\n`;
      });
      markdown += `\n`;
    }
    
    if (analysis.analysisResults.detectedPatterns) {
      markdown += `## Detected Patterns\n`;
      analysis.analysisResults.detectedPatterns.forEach(pattern => {
        markdown += `- ${pattern}\n`;
      });
      markdown += `\n`;
    }
    
    if (analysis.analysisResults.recommendations) {
      markdown += `## Recommendations\n`;
      analysis.analysisResults.recommendations.forEach(rec => {
        markdown += `- ${rec}\n`;
      });
    }
    
    return markdown;
  }
  
  startNewConversation() {
    this.state.currentConversation = {
      id: Date.now(),
      title: 'New Conversation',
      messages: [],
      timestamp: new Date().toISOString()
    };
    
    this.components.chatArea.clearMessages();
    this.components.chatArea.showWelcome();
  }
  
  async handleSendMessage(message) {
    if (!this.state.user) {
      this.showLoginPrompt();
      return;
    }
    
    // Add user message to chat
    this.components.chatArea.addMessage({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Show typing indicator
    this.components.chatArea.showTypingIndicator();
    
    // Process message with MCP if connected
    if (this.state.mcpConnected) {
      try {
        const response = await this.mcpClient.sendMessage(message);
        this.components.chatArea.hideTypingIndicator();
        this.components.chatArea.addMessage({
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('MCP message failed:', error);
        this.components.chatArea.hideTypingIndicator();
        this.components.chatArea.addMessage({
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your message. Please try again.',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Fallback response
      this.components.chatArea.hideTypingIndicator();
      this.components.chatArea.addMessage({
        role: 'assistant',
        content: 'Hello! I can help you analyze iris images. Please upload an iris photo to get started.',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  async handleImageUpload(file) {
    if (!this.state.user) {
      this.showLoginPrompt();
      return;
    }
    
    // Add user message with image
    this.components.chatArea.addMessage({
      role: 'user',
      content: 'I\'ve uploaded an iris image for analysis.',
      timestamp: new Date().toISOString(),
      image: URL.createObjectURL(file)
    });
    
    // Show typing indicator
    this.components.chatArea.showTypingIndicator();
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('irisImage', file);
      
      const response = await fetch('/api/analysis/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      this.components.chatArea.hideTypingIndicator();
      
      if (response.ok) {
        // Add analysis results
        this.components.chatArea.addMessage({
          role: 'assistant',
          content: this.formatAnalysisResults(data.data),
          timestamp: new Date().toISOString(),
          analysisData: data.data
        });
        
        // Reload conversations
        await this.loadConversations();
      } else {
        this.components.chatArea.addMessage({
          role: 'assistant',
          content: `Error: ${data.message}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      this.components.chatArea.hideTypingIndicator();
      this.components.chatArea.addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error analyzing the image. Please try again.',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    this.state.user = null;
    window.location.reload();
  }
}

// Initialize the app when DOM is ready
const app = new ViScanApp();
window.app = app; // Make it globally accessible for inline event handlers

export default ViScanApp;
