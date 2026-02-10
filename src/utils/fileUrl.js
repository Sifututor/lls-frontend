/**
 * Backend server base URL (no /api). Used for storage/file URLs.
 */
export const FILE_SERVER_BASE = 'http://10.0.0.178:8000';

/**
 * Convert relative file path to full backend URL.
 * Use for downloads/materials so React Router does not treat them as app routes.
 *
 * @param {string} filePath - Relative path (e.g. "Light_Waves.pdf", "materials/file.pdf", "storage/materials/file.pdf")
 * @returns {string|null} Full URL or null if filePath is empty
 */
export function getFullFileUrl(filePath) {
  if (!filePath || typeof filePath !== 'string') return null;

  const trimmed = filePath.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, '');

  if (cleanPath.startsWith('storage/')) {
    return `${FILE_SERVER_BASE}/${cleanPath}`;
  }

  return `${FILE_SERVER_BASE}/storage/${cleanPath}`;
}
