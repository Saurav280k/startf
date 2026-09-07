import { create } from 'zustand';

const storedUser = localStorage.getItem('modern_teams_user') || localStorage.getItem('apex_user');
const storedToken = localStorage.getItem('modern_teams_token') || localStorage.getItem('apex_token');

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,

  setAuth: (user, token) => {
    localStorage.setItem('modern_teams_user', JSON.stringify(user));
    localStorage.setItem('modern_teams_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('modern_teams_user');
    localStorage.removeItem('modern_teams_token');
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('modern_teams_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
