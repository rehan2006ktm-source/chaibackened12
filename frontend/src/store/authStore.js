import { create } from "zustand";
import { authApi } from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("accessToken") || "",
  isBootstrapping: true,
  isAuthenticated: false,
  setToken: (token) => {
    if (!token) {
      localStorage.removeItem("accessToken");
      set({ token: "" });
      return;
    }
    localStorage.setItem("accessToken", token);
    set({ token });
  },
  bootstrap: async () => {
    if (!get().token) {
      set({ user: null, isAuthenticated: false, isBootstrapping: false });
      return;
    }
    try {
      const { data } = await authApi.getCurrentUser();
      set({
        user: data?.data || null,
        isAuthenticated: Boolean(data?.data),
        isBootstrapping: false,
      });
    } catch {
      get().setToken("");
      set({ user: null, isAuthenticated: false, isBootstrapping: false });
    }
  },
  login: async (payload) => {
    const response = await authApi.login(payload);
    const token = response?.data?.data?.accessToken;
    const user = response?.data?.data?.user;
    get().setToken(token);
    set({ user, isAuthenticated: true });
    return response;
  },
  register: async (formData) => authApi.register(formData),
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      get().setToken("");
      set({ user: null, isAuthenticated: false });
    }
  },
}));
