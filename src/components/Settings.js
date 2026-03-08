// Settings component for MCP configuration and preferences
class Settings {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById('settingsModal');
  }
  
  open() {
    this.render();
    this.modal.classList.remove('hidden');
  }
  
  close() {
    this.modal.classList.add('hidden');
  }
  
  render() {
    const mcpConfig = JSON.parse(localStorage.getItem('mcpConfig') || '{}');
    
    this.modal.innerHTML = `
      <div class="settings-content">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 600;">Settings</h2>
          <button onclick="app.components.settings.close()" class="btn-secondary" 
            style="padding: 0.5rem 0.75rem;">
            ✕
          </button>
        </div>
        
        <!-- Theme Settings -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Appearance</h3>
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <span>Theme</span>
              <select id="themeSelect" class="btn-secondary" style="padding: 0.5rem 0.75rem;">
                <option value="dark" ${this.app.state.theme === 'dark' ? 'selected' : ''}>Dark</option>
                <option value="light" ${this.app.state.theme === 'light' ? 'selected' : ''}>Light</option>
              </select>
            </label>
          </div>
        </div>
        
        <!-- MCP Settings -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
            MCP (Model Context Protocol)
          </h3>
          <p style="font-size: 0.875rem; color: var(--dark-text-muted); margin-bottom: 1rem;">
            Configure MCP server connection for enhanced iris analysis capabilities.
          </p>
          
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500;">
                MCP Server URL
              </label>
              <input type="text" id="mcpServerUrl" 
                value="${mcpConfig.serverUrl || 'http://localhost:3001'}"
                class="chat-input" style="padding: 0.75rem; width: 100%;"
                placeholder="http://localhost:3001">
            </div>
            
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500;">
                API Key (Optional)
              </label>
              <input type="password" id="mcpApiKey" 
                value="${mcpConfig.apiKey || ''}"
                class="chat-input" style="padding: 0.75rem; width: 100%;"
                placeholder="Enter API key if required">
            </div>
            
            <div style="display: flex; gap: 1rem;">
              <button onclick="app.components.settings.testMCPConnection()" class="btn btn-secondary">
                Test Connection
              </button>
              <button onclick="app.components.settings.saveMCPConfig()" class="btn btn-primary">
                Save Configuration
              </button>
            </div>
            
            <div id="mcpTestResult" style="margin-top: 1rem; display: none;"></div>
          </div>
        </div>
        
        <!-- Analysis Settings -->
        <div style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Analysis Preferences</h3>
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem;">
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 1rem;">
              <span>Default Analysis Mode</span>
              <select id="defaultAnalysisMode" class="btn-secondary" style="padding: 0.5rem 0.75rem;">
                <option value="full">Full Analysis</option>
                <option value="quick">Quick Scan</option>
                <option value="zones">Zone Focus</option>
              </select>
            </label>
            
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 1rem;">
              <span>Show Zone Overlay</span>
              <input type="checkbox" id="showZoneOverlay" checked 
                style="width: 20px; height: 20px; cursor: pointer;">
            </label>
            
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <span>Detailed Recommendations</span>
              <input type="checkbox" id="detailedRecommendations" checked 
                style="width: 20px; height: 20px; cursor: pointer;">
            </label>
          </div>
        </div>
        
        <!-- About -->
        <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid var(--iris-indigo); padding: 1rem; border-radius: 0.5rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
            ⚠️ Medical Disclaimer
          </h3>
          <p style="font-size: 0.875rem; color: var(--dark-text-muted); line-height: 1.6;">
            This application is for educational and informational purposes only. 
            Results are not medical diagnoses and should not replace professional medical advice. 
            Always consult qualified healthcare providers for medical concerns.
          </p>
        </div>
        
        <div style="margin-top: 2rem; text-align: center; color: var(--dark-text-muted); font-size: 0.875rem;">
          ViScan v1.0.0 - Iris Analysis System
        </div>
      </div>
    `;
    
    // Add event listeners
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.app.state.theme = e.target.value;
        localStorage.setItem('theme', e.target.value);
        this.app.applyTheme();
        this.app.components.header.render();
      });
    }
  }
  
  async testMCPConnection() {
    const resultDiv = document.getElementById('mcpTestResult');
    const serverUrl = document.getElementById('mcpServerUrl').value;
    const apiKey = document.getElementById('mcpApiKey').value;
    
    if (!resultDiv) return;
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--info);">
        <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
        Testing connection...
      </div>
    `;
    
    try {
      // Attempt to connect to MCP server
      const response = await fetch(`${serverUrl}/health`, {
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
      });
      
      if (response.ok) {
        resultDiv.innerHTML = `
          <div style="padding: 0.75rem; background: rgba(16, 163, 127, 0.2); border: 1px solid var(--success); border-radius: 0.5rem; color: var(--success);">
            ✓ Connection successful!
          </div>
        `;
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      resultDiv.innerHTML = `
        <div style="padding: 0.75rem; background: rgba(239, 68, 68, 0.2); border: 1px solid var(--error); border-radius: 0.5rem; color: var(--error);">
          ✗ Connection failed. Please check the server URL and try again.
        </div>
      `;
    }
  }
  
  saveMCPConfig() {
    const serverUrl = document.getElementById('mcpServerUrl').value;
    const apiKey = document.getElementById('mcpApiKey').value;
    
    const config = {
      serverUrl,
      apiKey
    };
    
    localStorage.setItem('mcpConfig', JSON.stringify(config));
    
    // Show success message
    const resultDiv = document.getElementById('mcpTestResult');
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        <div style="padding: 0.75rem; background: rgba(16, 163, 127, 0.2); border: 1px solid var(--success); border-radius: 0.5rem; color: var(--success);">
          ✓ Configuration saved successfully!
        </div>
      `;
      
      setTimeout(() => {
        resultDiv.style.display = 'none';
      }, 3000);
    }
    
    // Reinitialize MCP client
    this.app.initializeMCP();
  }
}

export default Settings;
