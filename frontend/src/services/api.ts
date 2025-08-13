import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.0.110:3000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutos para downloads grandes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  async login(credentials: { email: string; senha: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: {
    login: string;
    email: string;
    numero: string;
    senha: string;
    confirmarSenha: string;
  }) {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Serviços de livros
export const bookService = {
  async getAllBooks(page: number = 1, limit: number = 5) {
    const response = await api.get(`/books?page=${page}&limit=${limit}`);
    return response.data;
  },



  async getBookById(id: number) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async searchBooks(query: string, page: number = 1, limit: number = 5) {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPopularBooks(limit: number = 5) {
    const response = await api.get(`/books/popular?limit=${limit}`);
    return response.data;
  },

  async downloadBook(id: number) {
    const response = await api.get(`/books/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getBookCoverUrl(id: number) {
    return `${API_BASE_URL}/books/${id}/cover`;
  },

  getBookPdfUrl(id: number) {
    return `${API_BASE_URL}/books/${id}/download`;
  },
};

// Função para configurar URL base (útil para desenvolvimento)
export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export default api;
