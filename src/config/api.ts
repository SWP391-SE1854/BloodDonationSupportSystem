export const API_BASE_URL = 'http://localhost:5081/api';
export const API_TIMEOUT = 30000; // 30 seconds 

// Add debug logging for API configuration
console.log('API Configuration:', {
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT
}); 