import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/session`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createSession = async (dodgeCount) => {
  const response = await api.post('/', { dodgeCount });
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await api.get(`/${sessionId}`);
  return response.data;
};

export const updateSession = async (sessionId, data) => {
  const response = await api.patch(`/${sessionId}`, data);
  return response.data;
};

export const completeSession = async (sessionId) => {
  const response = await api.patch(`/${sessionId}/complete`);
  return response.data;
};
