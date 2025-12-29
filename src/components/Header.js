// Header component with settings and theme toggle
class Header {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('header');
  }
  
  render() {
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button onclick="app.components.sidebar.toggle()" class="btn-secondary" 
          style="padding: 0.5rem 0.75rem; display: none;" id="mobileSidebarToggle">
          ☰
        </button>
        <h1 style="font-size: 1.25rem; font-weight: 600; flex: 1;">
          ${this.app.state.currentConversation ? this.app.state.currentConversation.title : 'ViScan Iris Analysis'}
        </h1>
      </div>
      
      <div style="display: flex; align-items: center; gap: 1rem;">
        <!-- MCP Status -->
        <div id="mcpStatus" class="mcp-status">
          <div class="mcp-status-dot"></div>
          <span style="display: none;" id="mcpStatusText">MCP</span>
        </div>
        
        <!-- Analysis Mode Selector -->
        <select id="analysisMode" class="btn-secondary" style="padding: 0.5rem 0.75rem; cursor: pointer;">
          <option value="full">Full Analysis</option>
          <option value="quick">Quick Scan</option>
          <option value="zones">Zone Focus</option>
        </select>
        
        <!-- Theme Toggle -->
        <button onclick="window.dispatchEvent(new CustomEvent('themeToggle'))" 
          class="btn-secondary" style="padding: 0.5rem 0.75rem; font-size: 1.25rem;" 
          title="Toggle theme">
          ${this.app.state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <!-- Settings Button -->
        <button onclick="window.dispatchEvent(new CustomEvent('openSettings'))" 
          class="btn-secondary" style="padding: 0.5rem 0.75rem; font-size: 1.25rem;" 
          title="Settings">
          ⚙️
        </button>
      </div>
    `;
    
    // Show mobile sidebar toggle on mobile
    if (window.innerWidth < 768) {
      const toggleBtn = document.getElementById('mobileSidebarToggle');
      if (toggleBtn) toggleBtn.style.display = 'block';
    }
    
    // Update MCP status
    this.app.updateMCPStatus();
    
    // Add analysis mode change listener
    const modeSelect = document.getElementById('analysisMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this.app.state.analysisMode = e.target.value;
        console.log('Analysis mode changed to:', e.target.value);
      });
    }
  }
  
  updateTitle(title) {
    const titleElement = this.container.querySelector('h1');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
}

export default Header;
