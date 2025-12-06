// API Configuration
const API_URL = 'http://localhost:3000/api';

// Utility Functions
function getToken() {
  return localStorage.getItem('viscan_token');
}

function getUser() {
  const user = localStorage.getItem('viscan_user');
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem('viscan_token');
  localStorage.removeItem('viscan_user');
  window.location.href = 'auth.html';
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '2rem';
  notification.style.right = '2rem';
  notification.style.zIndex = '10000';
  notification.style.minWidth = '300px';
  notification.style.animation = 'fadeInUp 0.3s ease';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Format date in Arabic
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get health status emoji
function getHealthEmoji(status) {
  const emojis = {
    'excellent': '🌟',
    'good': '💚',
    'fair': '💛',
    'needs-attention': '🔶'
  };
  return emojis[status] || '📊';
}

// Get health status text in Arabic
function getHealthText(status) {
  const texts = {
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'needs-attention': 'يحتاج انتباه'
  };
  return texts[status] || status;
}

// Get zone health color
function getZoneColor(healthStatus) {
  const colors = {
    'normal': '#43e97b',
    'attention': '#feca57',
    'concern': '#ee5a6f'
  };
  return colors[healthStatus] || '#4facfe';
}
