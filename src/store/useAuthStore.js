import { create } from 'zustand';

const storedUser = localStorage.getItem('apex_user');
const storedToken = localStorage.getItem('apex_token');

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,

  setAuth: (user, token) => {
    localStorage.setItem('apex_user', JSON.stringify(user));
    localStorage.setItem('apex_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('apex_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
