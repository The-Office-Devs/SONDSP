import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import type { AuthUser } from './auth.types';

const TOKEN_KEY = 'sondsp-token';
const REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

const getInitialState = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (token) {
    try {
      const decoded = jwtDecode(token) as any;
      
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return {
          token: null,
          user: null,
          isAuthenticated: false,
        };
      }
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }
  }

  return {
    token,
    user: null,
    isAuthenticated: !!token,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  login: (token) => {
    localStorage.setItem(TOKEN_KEY, token);

    set({
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);

    // Limpa os tokens de refresh
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
  
  setUser: (user) => {
    set({ user });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updatedFields };
      return { user: updatedUser };
    });
  },
}));
