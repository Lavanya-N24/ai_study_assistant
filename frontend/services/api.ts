import axios from 'axios';

// Ensure NEXT_PUBLIC_API_URL is defined. Fallback for local development if not provided
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor: attach JWT token to every request ───────────────────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────────────

  /**
   * Register a new user
   */
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  /**
   * Login and receive a JWT token
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Login via Google OAuth token
   */
  googleLogin: async (token: string) => {
    const response = await apiClient.post('/auth/google', { token });
    return response.data;
  },

  /**
   * Save token to localStorage after login/register
   */
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  /**
   * Remove token (logout)
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },

  // ── Existing API calls ─────────────────────────────────────────────────

  /**
   * Upload a PDF file to the backend
   */
  uploadPDF: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Send a chat message and get AI response
   */
  sendMessage: async (question: string) => {
    const response = await apiClient.post('/chat/', {
      question,
      top_k: 4,
    });
    return response.data;
  },

  /**
   * Request a summary of the uploaded document
   */
  getSummary: async () => {
    const response = await apiClient.get('/summary/');
    return response.data;
  },

  /**
   * Request a generated quiz based on the uploaded document
   */
  getQuiz: async () => {
    const response = await apiClient.get('/quiz/');
    return response.data;
  },

  /**
   * Fetch user's study history from the backend
   */
  getHistory: async () => {
    const response = await apiClient.get('/history/');
    return response.data;
  },

  /**
   * Log a new study activity to the backend
   */
  addActivity: async (activity: { title: string, type: string, score?: string }) => {
    const response = await apiClient.post('/history/', activity);
    return response.data;
  }
};
