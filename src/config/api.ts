import { environment } from './environment';

// Use a CORS proxy if in development mode
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const USE_PROXY = false; // Set to true to enable the proxy - requires approval at https://cors-anywhere.herokuapp.com/

export const API_BASE_URL = USE_PROXY 
  ? `${CORS_PROXY}${environment.apiUrl}/api`
  : `${environment.apiUrl}/api`;
  
export const API_TIMEOUT = 30000; // 30 seconds

// Add debug logging for API configuration
console.log('API Configuration:', {
  baseUrl: API_BASE_URL,
  useProxy: USE_PROXY,
  timeout: API_TIMEOUT
}); 