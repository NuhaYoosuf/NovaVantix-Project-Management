import axios from 'axios';
import type { LoginRequest, Project, Task, TaskCreate, TaskUpdate } from './types.js';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: LoginRequest) => api.post<{ access_token: string; token_type: string }>('/auth/login', credentials),
};

export const projectsAPI = {
  list: (search?: string) => api.get<Project[]>(`/projects?q=${search || ''}`),
  create: (name: string, description?: string) => api.post<Project>('/projects', { name, description }),
  getTasks: (projectId: number, filters?: { status?: string; assignee?: number }) => 
    api.get<Task[]>(`/projects/${projectId}/tasks`, { params: filters }),
};

export const tasksAPI = {
  create: (projectId: number, task: TaskCreate) => 
    api.post<Task>(`/projects/${projectId}/tasks`, task),
  update: (taskId: number, update: TaskUpdate, version: number) => 
    api.patch<Task>(`/tasks/${taskId}`, update, { 
      headers: { 'If-Match': version.toString() } 
    }),
};

export default api;