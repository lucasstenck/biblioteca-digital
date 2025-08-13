export interface User {
  id: number;
  login: string;
  email: string;
  numero: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  pdf_url: string;
  folder_name: string;
  created_at: string;
  updated_at?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BooksResponse {
  books: Book[];
  pagination: Pagination;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  login: string;
  email: string;
  numero: string;
  senha: string;
  confirmarSenha: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  BookDetail: { bookId: number };
  Search: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Books: undefined;
  Profile: undefined;
};
