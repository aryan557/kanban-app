import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTasks = async (boardId = 'default') => {
  const res = await api.get(`/tasks?boardId=${boardId}`);
  return res.data;
};

export const createTask = async (task) => {
  const res = await api.post('/tasks', task);
  return res.data;
};

export const updateTask = async (taskId, updates) => {
  const res = await api.put(`/tasks/${taskId}`, updates);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

export const assignTask = async (taskId, userId) => {
  const res = await api.put(`/tasks/${taskId}/assign`, { userId });
  return res.data;
};

export const smartAssignTask = async (taskId) => {
  const res = await api.put(`/tasks/${taskId}/smart-assign`);
  return res.data;
};

export const fetchRecentActions = async () => {
  const res = await api.get('/actions/recent');
  return res.data;
};

export const fetchUsers = async () => {
  const res = await api.get('/auth/users');
  return res.data;
}; 