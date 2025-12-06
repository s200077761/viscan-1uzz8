// API Configuration
const API_CONFIG = {
  // For local development with emulators
  local: {
    baseURL: 'http://localhost:5001/viscan-app-081/us-central1/api',
  },
  // For production (Firebase hosting and external hosts like HF)
  production: {
    baseURL: 'https://us-central1-viscan-app-081.cloudfunctions.net/api',
  },
};

// Auto-detect environment
const isLocalhost = window.location.hostname === 'localhost' ||
                   window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost ?
  API_CONFIG.local.baseURL :
  API_CONFIG.production.baseURL;

// Export for use in other files
window.API_BASE_URL = API_BASE_URL;

console.log(`🔧 API Environment: ${isLocalhost ? 'LOCAL' : 'PRODUCTION'}`);
console.log(`🌐 API Base URL: ${API_BASE_URL}`);
