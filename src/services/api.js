import axios from 'axios';

// Point this at your deployed backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trailmuse-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize MongoDB _id to frontend id for all responses
api.interceptors.response.use((response) => {
  const normalize = (data) => {
    if (Array.isArray(data)) return data.map(normalize);
    if (data && typeof data === 'object') {
      if (data._id && !data.id) {
        data.id = data._id;
      }
    }
    return data;
  };
  response.data = normalize(response.data);
  return response;
});

// ---- Auth ----
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// ---- Trips ----
export const fetchTrips = async () => {
  const { data } = await api.get('/trips');
  return data;
};

export const createTrip = async (trip) => {
  const { data } = await api.post('/trips', trip);
  return data;
};

export const updateTripApi = async (id, trip) => {
  const { data } = await api.put(`/trips/${id}`, trip);
  return data;
};

export const deleteTripApi = async (id) => {
  const { data } = await api.delete(`/trips/${id}`);
  return data;
};

// ---- AI ----
export const generateItinerary = async ({ destination, country, days, interests, budgetLevel, pace }) => {
  const { data } = await api.post('/ai/itinerary', {
    destination,
    country,
    days,
    interests,
    budgetLevel,
    pace
  });
  return data;
};

// ---- Budgets ----
export const fetchBudgets = async () => {
  const { data } = await api.get('/budgets');
  return data;
};

export const createBudget = async (budget) => {
  const { data } = await api.post('/budgets', budget);
  return data;
};

export const updateBudgetApi = async (id, budget) => {
  const { data } = await api.put(`/budgets/${id}`, budget);
  return data;
};

export const deleteBudgetApi = async (id) => {
  const { data } = await api.delete(`/budgets/${id}`);
  return data;
};

// ---- Packing Lists ----
export const fetchPackingLists = async () => {
  const { data } = await api.get('/packing-lists');
  return data;
};

export const createPackingList = async (packingList) => {
  const { data } = await api.post('/packing-lists', packingList);
  return data;
};

export const updatePackingListApi = async (id, packingList) => {
  const { data } = await api.put(`/packing-lists/${id}`, packingList);
  return data;
};

export const deletePackingListApi = async (id) => {
  const { data } = await api.delete(`/packing-lists/${id}`);
  return data;
};

export default api;
