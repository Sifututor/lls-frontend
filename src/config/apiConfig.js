/**
 * Single source of truth for API and file server URLs.
 * Set REACT_APP_API_URL in .env for production (e.g. https://lms-sifu.tutorla.tech/api).
 * File server base is derived by removing /api or use REACT_APP_FILE_SERVER_BASE.
 */
const API_BASE = process.env.REACT_APP_API_URL || 'https://lms-sifu.tutorla.tech/api';
/** API root without /parent — use for public parent-access-by-token (GET /api/parent-access/:token) */
const API_BASE_ROOT = API_BASE.replace(/\/parent\/?$/, '');
const FILE_SERVER_BASE =
  process.env.REACT_APP_FILE_SERVER_BASE ||
  API_BASE.replace(/\/api\/?$/, '') ||
  'https://lms-sifu.tutorla.tech';

export { API_BASE, API_BASE_ROOT, FILE_SERVER_BASE };
