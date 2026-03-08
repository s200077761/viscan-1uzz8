// MessageBubble component for individual messages
class MessageBubble {
  constructor(message, app) {
    this.message = message;
    this.app = app;
  }
  
  render() {
    const isUser = this.message.role === 'user';
    const avatar = isUser ? '👤' : '🤖';
    const name = isUser ? (this.app.state.user?.username || 'You') : 'ViScan AI';
    const bubbleClass = isUser ? 'message-user' : 'message-assistant';
    const avatarBg = isUser ? 'var(--chatgpt-green)' : 'var(--iris-indigo)';
    
    // Process markdown content
    const content = this.processContent(this.message.content);
    
    // Check if message has an image
    const imageHtml = this.message.image ? `
      <div style="margin-top: 1rem;">
        <img src="${this.message.image}" alt="Iris scan" 
          style="max-width: 400px; width: 100%; border-radius: 0.75rem; border: 2px solid var(--iris-indigo);">
      </div>
    ` : '';
    
    return `
      <div class="message-bubble ${bubbleClass}">
        <div class="message-header">
          <div class="message-avatar" style="background: ${avatarBg};">${avatar}</div>
          <span>${this.escapeHtml(name)}</span>
          <span style="margin-left: auto; font-size: 0.75rem; color: var(--dark-text-muted); font-weight: normal;">
            ${this.formatTime(this.message.timestamp)}
          </span>
        </div>
        <div class="message-content">
          ${content}
          ${imageHtml}
        </div>
      </div>
    `;
  }
  
  processContent(text) {
    // Use marked.js to convert markdown to HTML
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
          if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
          }
          return code;
        }
      });
      
      return marked.parse(text);
    }
    
    // Fallback: basic formatting
    return this.basicMarkdown(text);
  }
  
  basicMarkdown(text) {
    // Convert line breaks
    text = this.escapeHtml(text);
    text = text.replace(/\n/g, '<br>');
    
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Headers
    text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Lists - wrap consecutive list items in ul tags
    text = text.replace(/((?:^- .+$\n?)+)/gm, (match) => {
      const items = match.replace(/^- (.+)$/gm, '<li>$1</li>');
      return '<ul>' + items + '</ul>';
    });
    
    return text;
  }
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default MessageBubble;
