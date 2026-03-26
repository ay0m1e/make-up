// Environment helpers for routing frontend requests to the Flask backend.
export function getBackendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL || "http://127.0.0.1:5000";
}

export function getBackendUrl(path: string) {
  return new URL(path, getBackendBaseUrl()).toString();
}
