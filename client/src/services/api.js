const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('skillswap_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An unexpected error occurred');
  }
  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  async getPublicProfile(userId) {
    const res = await fetch(`${BASE_URL}/auth/users/${userId}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Skills
  async getSkills(filterParams = {}) {
    const query = new URLSearchParams();
    if (filterParams.search) query.append('search', filterParams.search);
    if (filterParams.category && filterParams.category !== 'All') query.append('category', filterParams.category);
    if (filterParams.level && filterParams.level !== 'All') query.append('level', filterParams.level);
    if (filterParams.mode && filterParams.mode !== 'All') query.append('mode', filterParams.mode);
    if (filterParams.type && filterParams.type !== 'All') query.append('type', filterParams.type);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${BASE_URL}/skills${queryString}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async getMySkills() {
    const res = await fetch(`${BASE_URL}/skills/my`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async getSkillById(id) {
    const res = await fetch(`${BASE_URL}/skills/${id}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async createSkill(skillData) {
    const res = await fetch(`${BASE_URL}/skills`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(skillData),
    });
    return handleResponse(res);
  },

  async updateSkill(id, skillData) {
    const res = await fetch(`${BASE_URL}/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(skillData),
    });
    return handleResponse(res);
  },

  async deleteSkill(id) {
    const res = await fetch(`${BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Exchanges
  async sendExchangeRequest(requestData) {
    const res = await fetch(`${BASE_URL}/exchanges`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(requestData),
    });
    return handleResponse(res);
  },

  async getMyExchanges() {
    const res = await fetch(`${BASE_URL}/exchanges/my`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async updateExchangeStatus(id, status, responseNote = '', exchangeLocation = '') {
    const res = await fetch(`${BASE_URL}/exchanges/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status, responseNote, exchangeLocation }),
    });
    return handleResponse(res);
  },

  async deleteExchange(id) {
    const res = await fetch(`${BASE_URL}/exchanges/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Feedback
  async submitFeedback(feedbackData) {
    const res = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(feedbackData),
    });
    return handleResponse(res);
  },

  async getMyFeedback() {
    const res = await fetch(`${BASE_URL}/feedback/my`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Stats
  async getOverviewStats() {
    const res = await fetch(`${BASE_URL}/stats/overview`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async getDashboardData() {
    const res = await fetch(`${BASE_URL}/stats/dashboard`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },
};
