const RAW_API_BASE =
  import.meta.env.API_URL ||
  import.meta.env.API_BASE_URL ||
  'https://startb-production.up.railway.app/api';

const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const token =
    localStorage.getItem('modern_teams_token') ||
    localStorage.getItem('apex_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${cleanEndpoint}`, {
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
