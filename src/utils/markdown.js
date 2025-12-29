// Markdown utility functions
export function renderMarkdown(text) {
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
      highlight: function(code, lang) {
        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight error:', err);
          }
        }
        return code;
      }
    });
    
    return marked.parse(text);
  }
  
  // Fallback to basic markdown
  return basicMarkdown(text);
}

function basicMarkdown(text) {
  // Escape HTML
  text = escapeHtml(text);
  
  // Convert line breaks
  text = text.replace(/\n/g, '<br>');
  
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Code blocks
  text = text.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
    const langClass = lang ? `language-${lang}` : '';
    return `<pre><code class="${langClass}">${code}</code></pre>`;
  });
  
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
  
  // Links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  return text;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default {
  renderMarkdown,
  basicMarkdown,
  escapeHtml
};
