// MCP (Model Context Protocol) Client for iris analysis
import IrisTools from './irisTools.js';

class MCPClient {
  constructor() {
    this.config = JSON.parse(localStorage.getItem('mcpConfig') || '{}');
    this.serverUrl = this.config.serverUrl || 'http://localhost:3001';
    this.apiKey = this.config.apiKey || '';
    this.connected = false;
    this.tools = new IrisTools();
  }
  
  async connect() {
    try {
      // Check if MCP server is available
      const response = await fetch(`${this.serverUrl}/health`, {
        headers: this.getHeaders(),
        timeout: 5000
      }).catch(() => null);
      
      if (response && response.ok) {
        this.connected = true;
        await this.initializeTools();
        console.log('✅ MCP Client connected successfully');
        return true;
      } else {
        console.log('⚠️ MCP Server not available, running in standalone mode');
        this.connected = false;
        return false;
      }
    } catch (error) {
      console.error('MCP connection error:', error);
      this.connected = false;
      return false;
    }
  }
  
  async initializeTools() {
    try {
      // List available tools from MCP server
      const tools = await this.listTools();
      console.log('Available MCP tools:', tools);
    } catch (error) {
      console.error('Failed to initialize MCP tools:', error);
    }
  }
  
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }
  
  // MCP Protocol: tools/list
  async listTools() {
    if (!this.connected) {
      return this.tools.getLocalTools();
    }
    
    try {
      const response = await fetch(`${this.serverUrl}/mcp/tools/list`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/list',
          id: this.generateRequestId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result?.tools || [];
      }
    } catch (error) {
      console.error('MCP tools/list error:', error);
    }
    
    return this.tools.getLocalTools();
  }
  
  // MCP Protocol: tools/call
  async callTool(toolName, args) {
    if (!this.connected) {
      return this.tools.executeLocal(toolName, args);
    }
    
    try {
      const response = await fetch(`${this.serverUrl}/mcp/tools/call`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args
          },
          id: this.generateRequestId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.error('MCP tools/call error:', error);
    }
    
    return this.tools.executeLocal(toolName, args);
  }
  
  // MCP Protocol: resources/list
  async listResources() {
    if (!this.connected) {
      return [];
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.serverUrl}/mcp/resources/list`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'resources/list',
          id: this.generateRequestId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result?.resources || [];
      }
    } catch (error) {
      console.error('MCP resources/list error:', error);
    }
    
    return [];
  }
  
  // MCP Protocol: resources/read
  async readResource(uri) {
    if (!this.connected) {
      return null;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.serverUrl}/mcp/resources/read`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'resources/read',
          params: {
            uri: uri
          },
          id: this.generateRequestId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.error('MCP resources/read error:', error);
    }
    
    return null;
  }
  
  // MCP Protocol: prompts/list
  async listPrompts() {
    if (!this.connected) {
      return this.getDefaultPrompts();
    }
    
    try {
      const response = await fetch(`${this.serverUrl}/mcp/prompts/list`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'prompts/list',
          id: this.generateRequestId()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result?.prompts || this.getDefaultPrompts();
      }
    } catch (error) {
      console.error('MCP prompts/list error:', error);
    }
    
    return this.getDefaultPrompts();
  }
  
  // Send message with MCP context
  async sendMessage(message) {
    if (!this.connected) {
      return this.getDefaultResponse(message);
    }
    
    try {
      const response = await fetch(`${this.serverUrl}/mcp/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message: message,
          context: {
            tools: await this.listTools(),
            prompts: await this.listPrompts()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error('MCP chat error:', error);
    }
    
    return this.getDefaultResponse(message);
  }
  
  getDefaultResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('image') || lowerMessage.includes('scan')) {
      return 'To analyze an iris image, please click the camera icon 📷 below and upload a clear photo of the iris.';
    }
    
    if (lowerMessage.includes('zone') || lowerMessage.includes('area')) {
      return 'The iris is divided into multiple zones, each corresponding to different organs and body systems. Upload an iris image to see the detailed zone analysis.';
    }
    
    if (lowerMessage.includes('color')) {
      return 'Iris colors can provide insights into constitutional types and potential health tendencies. I can analyze dominant colors and patterns when you upload an iris image.';
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return `I can help you analyze iris images using iridology principles. Here's what I can do:

1. **Analyze iris images** - Upload a clear photo of the iris
2. **Zone mapping** - Identify which body organs correspond to different iris areas
3. **Color analysis** - Detect dominant colors and their health implications
4. **Pattern detection** - Identify lines, spots, and other iris features
5. **Health recommendations** - Provide general wellness suggestions based on findings

To get started, simply upload an iris image using the camera button 📷 below!`;
    }
    
    return 'Hello! I\'m your iris analysis assistant. I can help you understand iris patterns and their potential health implications. Please upload an iris image to get started, or ask me any questions about iridology.';
  }
  
  getDefaultPrompts() {
    return [
      {
        name: 'iris_analysis',
        description: 'Comprehensive iris analysis with zone mapping',
        template: 'Analyze this iris image and provide insights on health zones, dominant colors, and detected patterns.'
      },
      {
        name: 'quick_scan',
        description: 'Quick iris scan for basic assessment',
        template: 'Perform a quick scan of this iris image and highlight any notable features.'
      },
      {
        name: 'zone_focus',
        description: 'Focus on specific iris zones',
        template: 'Analyze the {zone} area of this iris and provide detailed insights.'
      }
    ];
  }
  
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  disconnect() {
    this.connected = false;
    console.log('MCP Client disconnected');
  }
}

export default MCPClient;
