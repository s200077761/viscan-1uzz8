// API Configuration - now loaded from config.js
// Use window.API_BASE_URL which is set in config.js
const API_URL = window.API_BASE_URL || '/api';


// Utility Functions
function getToken() {
  return localStorage.getItem('viscan_token');
}

function setToken(token) {
  localStorage.setItem('viscan_token', token);
}

function removeToken() {
  localStorage.removeItem('viscan_token');
}

function setUser(user) {
  localStorage.setItem('viscan_user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('viscan_user');
  return user ? JSON.parse(user) : null;
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 5000);
  }
}

function showLoading(show) {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.style.display = show ? 'block' : 'none';
  }
}

// Tab Switching
function switchTab(tab) {
  // Update tab buttons
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  // Update tab content
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(c => c.classList.remove('active'));
  
  if (tab === 'login') {
    document.getElementById('loginTab').classList.add('active');
  } else {
    document.getElementById('registerTab').classList.add('active');
  }
  
  // Clear messages
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');
  if (errorDiv) errorDiv.style.display = 'none';
  if (successDiv) successDiv.style.display = 'none';
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      showSuccess('تم تسجيل الدخول بنجاح! جاري التحويل...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showError(data.message || 'فشل تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('حدث خطأ في الاتصال. تأكد من تشغيل الخادم.');
  } finally {
    showLoading(false);
  }
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
  
  // Validate password match
  if (password !== passwordConfirm) {
    showError('كلمات المرور غير متطابقة');
    return;
  }
  
  try {
    showLoading(true);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      showSuccess('تم إنشاء الحساب بنجاح! جاري التحويل...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showError(data.message || 'فشل إنشاء الحساب. حاول مرة أخرى.');
    }
  } catch (error) {
    console.error('Register error:', error);
    showError('حدث خطأ في الاتصال. تأكد من تشغيل الخادم.');
  } finally {
    showLoading(false);
  }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token && window.location.pathname.includes('auth.html')) {
    // Verify token is still valid
    fetch(`${API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = 'dashboard.html';
      }
    })
    .catch(err => {
      console.log('Token verification failed');
    });
  }
});
