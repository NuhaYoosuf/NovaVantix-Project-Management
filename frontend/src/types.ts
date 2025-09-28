export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee_user_id: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TaskCreate {
  title: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  status?: 'todo' | 'in_progress' | 'done';
  assignee_user_id?: number;
  version: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';