// src/api.ts

// Change from process.env.REACT_APP_API_BASE_URL
// To import.meta.env.VITE_APP_API_BASE_URL
export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';