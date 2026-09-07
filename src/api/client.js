const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('apex_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  changePassword: (newPassword) =>
    request('/auth/change-password', { method: 'PUT', body: JSON.stringify({ newPassword }) }),

  // Accounts
  getAccounts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    return request(`/accounts?${query.toString()}`);
  },
  getFeaturedAccounts: () => request('/accounts/featured'),
  getAccountById: (id) => request(`/accounts/${id}`),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    return request(`/services?${query.toString()}`);
  },
  getServiceById: (id) => request(`/services/${id}`),

  // Internships
  getInternships: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, val);
    });
    return request(`/internships?${query.toString()}`);
  },
  getInternshipById: (id) => request(`/internships/${id}`),
  applyForInternship: (id, applicationData) =>
    request(`/internships/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  // Orders & Payment Gateway
  createOrder: (orderData) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getOrderById: (id) => request(`/orders/${id}`),
  getMyOrders: (email) => request(`/orders/my-orders${email ? `?email=${encodeURIComponent(email)}` : ''}`),
};
