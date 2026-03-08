// Sidebar component for conversation history and navigation
class Sidebar {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('sidebar');
    this.collapsed = window.innerWidth < 768;
  }
  
  render() {
    const conversations = this.app.state.conversations || [];
    
    this.container.innerHTML = `
      <div class="sidebar-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.5rem;">👁️</span>
          <span style="font-weight: 600;">ViScan</span>
        </div>
        <button onclick="app.components.sidebar.toggle()" class="btn-secondary" 
          style="padding: 0.5rem; border-radius: 0.5rem; display: none;" id="sidebarToggle">
          ☰
        </button>
      </div>
      
      <div style="padding: 1rem; border-bottom: 1px solid var(--dark-border);">
        <button onclick="window.dispatchEvent(new CustomEvent('newConversation'))" 
          class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <span style="font-size: 1.25rem;">+</span>
          New Conversation
        </button>
      </div>
      
      <div class="sidebar-content">
        <div style="padding: 0.5rem; color: var(--dark-text-muted); font-size: 0.875rem; font-weight: 600;">
          SCAN HISTORY
        </div>
        ${conversations.length > 0 ? this.renderConversations(conversations) : this.renderEmptyState()}
      </div>
      
      <div style="padding: 1rem; border-top: 1px solid var(--dark-border); margin-top: auto;">
        ${this.app.state.user ? `
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--iris-indigo); display: flex; align-items: center; justify-content: center;">
              ${this.app.state.user.username.charAt(0).toUpperCase()}
            </div>
            <div style="flex: 1; overflow: hidden;">
              <div style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${this.app.state.user.username}
              </div>
              <div style="font-size: 0.75rem; color: var(--dark-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${this.app.state.user.email}
              </div>
            </div>
          </div>
          <button onclick="app.logout()" class="btn btn-secondary" style="width: 100%;">
            Logout
          </button>
        ` : ''}
      </div>
    `;
    
    if (this.collapsed) {
      this.container.classList.add('sidebar-collapsed');
    }
    
    // Show toggle button on mobile
    if (window.innerWidth < 768) {
      const toggleBtn = document.getElementById('sidebarToggle');
      if (toggleBtn) toggleBtn.style.display = 'block';
    }
  }
  
  renderConversations(conversations) {
    return conversations.map(conv => `
      <div class="sidebar-item" onclick="app.components.sidebar.selectConversation('${conv.id}')">
        <span style="font-size: 1.25rem;">💬</span>
        <div style="flex: 1; overflow: hidden;">
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem;">
            ${this.escapeHtml(conv.title)}
          </div>
          <div style="font-size: 0.75rem; color: var(--dark-text-muted);">
            ${this.formatDate(conv.timestamp)}
          </div>
        </div>
      </div>
    `).join('');
  }
  
  renderEmptyState() {
    return `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--dark-text-muted);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📁</div>
        <div style="font-size: 0.875rem;">No scan history yet</div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem;">Upload an iris image to start</div>
      </div>
    `;
  }
  
  updateConversations(conversations) {
    this.app.state.conversations = conversations;
    this.render();
  }
  
  selectConversation(id) {
    const conversation = this.app.state.conversations.find(c => c.id === id);
    if (conversation) {
      this.app.state.currentConversation = conversation;
      this.app.components.chatArea.loadConversation(conversation);
    }
  }
  
  toggle() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.container.classList.add('sidebar-collapsed');
    } else {
      this.container.classList.remove('sidebar-collapsed');
    }
  }
  
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default Sidebar;
